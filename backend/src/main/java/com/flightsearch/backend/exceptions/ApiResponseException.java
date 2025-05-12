package com.flightsearch.backend.exceptions;

public class ApiResponseException extends RuntimeException {
  public ApiResponseException(String message) {
    super(message);
  }

  public static class ApiClientException extends RuntimeException {
    public ApiClientException(String message) {
      super(message);
    }
  }

  public static class ApiServerException extends RuntimeException {
    public ApiServerException(String message) {
      super(message);
    }
  }
}
