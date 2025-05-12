package com.flightsearch.backend.exceptions;

public class SearchFlightException extends RuntimeException {
    public SearchFlightException(String message) {
        super(message);
    }

    public static class NoFlightsFoundException extends RuntimeException {
      public NoFlightsFoundException(String message) {
        super(message);
      }
    }
}
