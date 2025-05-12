package com.flightsearch.backend.dto.request;

import com.flightsearch.backend.enums.IATACodeType;
import com.nimbusds.openid.connect.sdk.assurance.claims.CountryCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationSearchRequestDTO {
    String keyword;
    Integer pageLimit;
    Integer pageOffset;
}
