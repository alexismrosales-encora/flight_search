package com.flightsearch.backend.client;

import com.flightsearch.backend.auth.AmadeusTokenService;
import com.flightsearch.backend.config.AmadeusProperties;
import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.entity.request.FlightSearchRequest;
import com.flightsearch.backend.exceptions.ApiResponseException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

        public Mono<List<AmadeusOfferDTO.AmadeusOfferResponseSimplified>> search(FlightSearchRequest req) {
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
            return makeGetRequest(
                    uri,
                    AmadeusOfferDTO.AmadeusOfferResponse.class)
                    .flatMapIterable(res -> res.data)
                    .map(offer -> {
                        var seg = offer.itineraries.get(0).segments.get(0);
                        return new AmadeusOfferDTO.AmadeusOfferResponseSimplified(
                                offer.id,
                                offer.source,
                                seg.carrierCode,
                                seg.flightNumber,
                                seg.departure.at,
                                seg.arrival.at,
                                Double.parseDouble(offer.price.total),
                                offer.price.currency
                        );
                    })
                    .collectList();
        }

        private <T> Mono<T> makeGetRequest(UriComponentsBuilder uri, Class<T> responseType) {
            String token = amadeusTokenService.getBearerToken();
            log.info("Fetched Bearer Token: {}", amadeusTokenService.getBearerToken());  // Log the token value
            log.info("Making GET request to {}", uri.toUriString());
            return webClient.get()
                    .uri(uri.toUriString())
                    .headers(h-> h.setBearerAuth(token))
                    .retrieve()
                    .onStatus(httpStatusCode -> httpStatusCode.is4xxClientError(),
                            clientResponse -> Mono.error(
                                    new ApiResponseException.ApiClientException("Client error: " + clientResponse.statusCode())
                            ))
                    .onStatus(httpStatusCode -> httpStatusCode.is5xxServerError(),
                            clientResponse -> Mono.error(
                                    new ApiResponseException.ApiServerException("Server error: " + clientResponse.statusCode())
                            ))
                    .bodyToMono(responseType);

        }
}
