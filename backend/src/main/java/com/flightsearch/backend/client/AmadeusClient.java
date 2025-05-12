package com.flightsearch.backend.client;

import com.flightsearch.backend.auth.AmadeusTokenService;
import com.flightsearch.backend.config.AmadeusProperties;
import com.flightsearch.backend.dto.amadeus.AmadeusAirportCodesDTO;
import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.dto.response.FlightSearchResponseDTO;
import com.flightsearch.backend.dto.response.LocationSearchResponseDTO;
import com.flightsearch.backend.entity.request.FlightSearchRequest;
import com.flightsearch.backend.entity.request.LocationSearchRequest;
import com.flightsearch.backend.exceptions.ApiResponseException;
import com.flightsearch.backend.mapper.response.FlightSearchResponseMapper;
import com.flightsearch.backend.mapper.response.LocationSearchResponseMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class AmadeusClient {
        private final WebClient webClient ;
        private final AmadeusTokenService amadeusTokenService;
        private final AmadeusProperties amadeusProperties;

        // Searching for specific offers
        public Mono<List<FlightSearchResponseDTO>> searchFlights(FlightSearchRequest req) {
            UriComponentsBuilder uri = UriComponentsBuilder
                    .fromUriString(amadeusProperties.getHost())
                    .path("/v2/shopping/flight-offers")
                    .queryParam("originLocationCode",   req.getOriginLocationCode())
                    .queryParam("destinationLocationCode", req.getDestinationLocationCode())
                    .queryParam("departureDate",        req.getDepartureDate())
                    .queryParam("returnDate",           req.getReturnDate())
                    .queryParam("adults",               req.getAdults())
                    .queryParam("children",             req.getChildren())
                    .queryParam("infants",              req.getInfants())
                    .queryParam("max",                 req.getMax());

            // using non-blocking api request to amadeus
            return makeGetRequest(uri, AmadeusOfferDTO.AmadeusOfferResponse.class)
                        .flatMapIterable(res -> res.data)
                    .map(FlightSearchResponseMapper::mapToFlightResponse)
                    .collectList();
        }

        // Searching for IATA codes
        public Mono<LocationSearchResponseDTO> searchLocations(LocationSearchRequest req) {
            UriComponentsBuilder uri = UriComponentsBuilder
                    .fromUriString(amadeusProperties.getHost())
                    .path("/v1/reference-data/locations")
                    .queryParam("subType", "AIRPORT") // Setting airport locations type
                    .queryParam("keyword", req.getKeyword())
                    // TODO: Check how to use correctly these parameters and implemented for pagination
                    //.queryParam("page[limit]", req.getPageLimit())
                    //.queryParam("page[offset]", req.getPageOffset())
                    .queryParam("sort", "analytics.travelers.score") // Setting sort by analytics
                    .queryParam("view","LIGHT");


            log.info("Making Search Locations request with: ",uri);
            // using non-blocking api request to amadeus
            return makeGetRequest(uri, AmadeusAirportCodesDTO.AmadeusAirportCodesResponse.class)
                    .map(res -> new LocationSearchResponseDTO(
                            res.meta.count,
                            res.data.stream()
                                    .map(location -> new LocationSearchResponseDTO.LocationDTO(
                                            location.iataCode,
                                            location.name,
                                            location.address.cityName,
                                            location.address.countryName
                                    ))
                                    .toList()
                    ));
        }

        private <T> Mono<T> makeGetRequest(UriComponentsBuilder uri, Class<T> responseType) {
            String token = amadeusTokenService.getBearerToken();
            log.info("Fetched Bearer Token: {}", amadeusTokenService.getBearerToken());  // Log the token value
            log.info("Making GET request to {}", uri.toUriString());
            return webClient.get()
                    .uri(uri.toUriString())
                    .headers(h-> h.setBearerAuth(token))
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError,  resp ->
                            resp.bodyToMono(String.class)
                                    .flatMap(body -> {
                                        log.error("Amadeus returned 4xx error body: {}", body);
                                        return Mono.error(
                                                new ApiResponseException.ApiClientException(
                                                        "Client error " + resp.statusCode() + ": " + body
                                                )
                                        );
                                    }))
                    .onStatus(HttpStatusCode::is5xxServerError,  clientResponse -> Mono.error(
                                    new ApiResponseException.ApiServerException("Server error: " + clientResponse.statusCode())
                            ))
                    .bodyToMono(responseType);

        }
}
