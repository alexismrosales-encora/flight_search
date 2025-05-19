package com.flightsearch.backend.mapper.response;

import com.flightsearch.backend.dto.amadeus.AmadeusOfferDTO;
import com.flightsearch.backend.dto.response.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


public class FlightSearchResponseMapper {

    private static final DateTimeFormatter amadeusDateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    // mapToFlightResponse: Map the AmadeusOfferResponseDTO to the FlightSearchResponseDTO, also handling and interpreting the logic
    // of different tasks to make it more readable
    public static FlightSearchResponseDTO mapToFlightResponse(
            AmadeusOfferDTO.AmadeusOffer offer,
            AmadeusOfferDTO.Dictionaries dictionaries) {

        if (offer == null) {
            return null;
        }

        FlightSearchResponseDTO responseDTO = new FlightSearchResponseDTO();
        responseDTO.setOfferId(offer.id);
        responseDTO.setNumberOfBookableSeats(offer.numberOfBookableSeats);
        responseDTO.setLastTicketingDate(offer.lastTicketingDate);
        responseDTO.setValidatingAirlineCodes(offer.validatingAirlineCodes != null ? new ArrayList<>(offer.validatingAirlineCodes) : Collections.emptyList());

        // Map Price Summary
        if (offer.price != null) {
            FlightSearchResponseDTO.PriceSummaryDTO priceSummary = new FlightSearchResponseDTO.PriceSummaryDTO();
            priceSummary.setCurrencyCode(offer.price.currency);
            priceSummary.setCurrencyName(getCurrencyName(offer.price.currency, dictionaries));
            priceSummary.setBasePrice(offer.price.base);
            priceSummary.setTotalPrice(offer.price.total);
            priceSummary.setGrandTotal(offer.price.grandTotal);
            if (offer.price.fees != null) {
                priceSummary.setFees(offer.price.fees.stream()
                        .map(FlightSearchResponseMapper::mapToFeeInfoDTO)
                        .collect(Collectors.toList()));
            } else {
                priceSummary.setFees(Collections.emptyList());
            }
            responseDTO.setPriceSummary(priceSummary);
        }

        // Map Itineraries and Segments
        if (offer.itineraries != null) {
            List<FlightSearchResponseDTO.ItineraryDTO> itineraryDTOs = new ArrayList<>();
            for (AmadeusOfferDTO.Itinerary itinerary : offer.itineraries) {
                FlightSearchResponseDTO.ItineraryDTO itineraryDTO = new FlightSearchResponseDTO.ItineraryDTO();
                itineraryDTO.setTotalDuration(itinerary.duration);

                List<FlightSearchResponseDTO.FlightLegDTO> flightLegs = new ArrayList<>();
                if (itinerary.segments != null) {
                    for (int i = 0; i < itinerary.segments.size(); i++) {
                        AmadeusOfferDTO.Segment segment = itinerary.segments.get(i);
                        FlightSearchResponseDTO.FlightLegDTO legDTO = mapSegmentToFlightLegDTO(segment, dictionaries);

                        if (i < itinerary.segments.size() - 1) {
                            AmadeusOfferDTO.Segment nextSegment = itinerary.segments.get(i + 1);
                            legDTO.setLayoverDuration(calculateLayover(segment.arrival.at, nextSegment.departure.at));
                        } else {
                            legDTO.setLayoverDuration(null); // No layover after the last segment in this itinerary
                        }
                        flightLegs.add(legDTO);
                    }
                }
                itineraryDTO.setSegments(flightLegs);
                itineraryDTOs.add(itineraryDTO);
            }
            responseDTO.setItineraries(itineraryDTOs);
        } else {
            responseDTO.setItineraries(Collections.emptyList());
        }

        // Map Traveler Pricings
        if (offer.travelerPricings != null) {
            responseDTO.setTravelerPricings(offer.travelerPricings.stream()
                    .map(tp -> mapToTravelerPricingInfoDTO(tp, dictionaries))
                    .collect(Collectors.toList()));
        } else {
            responseDTO.setTravelerPricings(Collections.emptyList());
        }

        return responseDTO;
    }

    private static FlightSearchResponseDTO.FeeInfoDTO mapToFeeInfoDTO(AmadeusOfferDTO.Fee fee) {
        FlightSearchResponseDTO.FeeInfoDTO feeInfo = new FlightSearchResponseDTO.FeeInfoDTO();
        feeInfo.setAmount(fee.amount);
        feeInfo.setType(fee.type);
        return feeInfo;
    }

    private static FlightSearchResponseDTO.FlightLegDTO mapSegmentToFlightLegDTO(
            AmadeusOfferDTO.Segment segment,
            AmadeusOfferDTO.Dictionaries dictionaries) {

        FlightSearchResponseDTO.FlightLegDTO legDTO = new FlightSearchResponseDTO.FlightLegDTO();
        legDTO.setId(segment.segmentId);

        if (segment.departure != null) {
            legDTO.setDepartureAirportCode(segment.departure.iataCode);
            legDTO.setDepartureAirportTerminal(segment.departure.terminal);
            legDTO.setDepartureTime(segment.departure.at);
        }
        if (segment.arrival != null) {
            legDTO.setArrivalAirportCode(segment.arrival.iataCode);
            legDTO.setArrivalAirportTerminal(segment.arrival.terminal);
            legDTO.setArrivalTime(segment.arrival.at);
        }

        legDTO.setDuration(segment.duration);
        legDTO.setFlightNumber(segment.flightNumber);
        legDTO.setMarketingAirlineCode(segment.carrierCode);
        legDTO.setMarketingAirlineName(getCarrierName(segment.carrierCode, dictionaries));

        if (segment.operating != null && segment.operating.carrierCode != null) {
            legDTO.setOperatingAirlineCode(segment.operating.carrierCode);
            // Show operating airline name, can be same as marketing if codes match
            legDTO.setOperatingAirlineName(getCarrierName(segment.operating.carrierCode, dictionaries));
        }


        if (segment.aircraft != null) {
            legDTO.setAircraftTypeName(getAircraftName(segment.aircraft.code, dictionaries));
        }
        legDTO.setNumberOfStops(segment.numberOfStops);
        // layoverDuration is set in the calling loop
        return legDTO;
    }

    private static FlightSearchResponseDTO.TravelerPricingInfoDTO mapToTravelerPricingInfoDTO(
            AmadeusOfferDTO.TravelerPricing travelerPricing,
            AmadeusOfferDTO.Dictionaries dictionaries) {

        FlightSearchResponseDTO.TravelerPricingInfoDTO tpInfo = new FlightSearchResponseDTO.TravelerPricingInfoDTO();
        tpInfo.setTravelerId(travelerPricing.travelerId);
        tpInfo.setTravelerType(travelerPricing.travelerType);
        tpInfo.setFareOption(travelerPricing.fareOption);

        if (travelerPricing.price != null) {
            tpInfo.setTotalPrice(travelerPricing.price.total);
            tpInfo.setBasePrice(travelerPricing.price.base);
            tpInfo.setCurrencyCode(travelerPricing.price.currency);
        }

        if (travelerPricing.fareDetailsBySegment != null) {
            tpInfo.setFareDetailsBySegment(travelerPricing.fareDetailsBySegment.stream()
                    .map(FlightSearchResponseMapper::mapToFareDetailPerSegmentDTO)
                    .collect(Collectors.toList()));
        } else {
            tpInfo.setFareDetailsBySegment(Collections.emptyList());
        }
        return tpInfo;
    }

    private static FlightSearchResponseDTO.FareDetailPerSegmentDTO mapToFareDetailPerSegmentDTO(
            AmadeusOfferDTO.FareDetailsBySegment fareDetail) {

        FlightSearchResponseDTO.FareDetailPerSegmentDTO fdDTO = new FlightSearchResponseDTO.FareDetailPerSegmentDTO();
        fdDTO.setSegmentId(fareDetail.segmentId);
        fdDTO.setCabin(fareDetail.cabin);
        fdDTO.setBookingClass(fareDetail.bookingClass);
        fdDTO.setFareBasis(fareDetail.fareBasis);

        if (fareDetail.includedCheckedBags != null) {
            StringBuilder bagsDesc = new StringBuilder();
            if (fareDetail.includedCheckedBags.quantity != null) {
                bagsDesc.append(fareDetail.includedCheckedBags.quantity).append(" piece(s)");
            } else if (fareDetail.includedCheckedBags.weight != null && fareDetail.includedCheckedBags.weightUnit != null) {
                bagsDesc.append(fareDetail.includedCheckedBags.weight).append(" ").append(fareDetail.includedCheckedBags.weightUnit);
            } else {
                bagsDesc.append("Details unavailable");
            }
            fdDTO.setIncludedCheckedBagsDescription(bagsDesc.toString());
        } else {
            fdDTO.setIncludedCheckedBagsDescription("Not specified");
        }


        if (fareDetail.amenities != null) {
            fdDTO.setAmenities(fareDetail.amenities.stream()
                    .map(FlightSearchResponseMapper::mapToAmenityInfoDTO)
                    .collect(Collectors.toList()));
        } else {
            fdDTO.setAmenities(Collections.emptyList());
        }
        return fdDTO;
    }

    private static FlightSearchResponseDTO.AmenityInfoDTO mapToAmenityInfoDTO(AmadeusOfferDTO.Amenity amenity) {
        FlightSearchResponseDTO.AmenityInfoDTO amenityInfo = new FlightSearchResponseDTO.AmenityInfoDTO();
        amenityInfo.setName(amenity.name);
        amenityInfo.setIsChargeable(amenity.isChargeable);
        amenityInfo.setDescription(amenity.description);
        return amenityInfo;
    }

    // Helper methods for dictionary lookups
    private static String getCarrierName(String code, AmadeusOfferDTO.Dictionaries dictionaries) {
        if (code == null || dictionaries == null || dictionaries.carriers == null) return code != null ? code : "Unknown";
        return dictionaries.carriers.getOrDefault(code, code);
    }

    private static String getAircraftName(String code, AmadeusOfferDTO.Dictionaries dictionaries) {
        if (code == null || dictionaries == null || dictionaries.aircraft == null) return "Unknown Aircraft";
        return dictionaries.aircraft.getOrDefault(code, "Code: " + code);
    }

    private static String getCurrencyName(String code, AmadeusOfferDTO.Dictionaries dictionaries) {
        if (code == null || dictionaries == null || dictionaries.currencies == null) return code != null ? code : "";
        return dictionaries.currencies.getOrDefault(code, code);
    }

    // Helper method to calculate layover duration
    private static String calculateLayover(String arrivalAtStr, String departureAtStr) {
        try {
            LocalDateTime arrivalTime = LocalDateTime.parse(arrivalAtStr, amadeusDateTimeFormatter);
            LocalDateTime departureTime = LocalDateTime.parse(departureAtStr, amadeusDateTimeFormatter);
            Duration duration = Duration.between(arrivalTime, departureTime);

            if (duration.isNegative() || duration.isZero()) return "N/A"; // Or handle as an error/short connection

            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();

            return String.format("%dH %02dM", hours, minutes);
        } catch (Exception e) {
            return "Error";
        }
    }
}
