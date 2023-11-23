package com.tasks.config;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.text.ParseException;
import java.util.*;

@Component
@Configuration
public class JwtTokenProvider {

    private final static String ROLES_FIELD = "roles";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMinutes}")
    private long expirationMinutes;

    @Value("${auth.server.jwksEndPointUrl}")
    private String jwksEndPointUrl;

    private JWKSet jwkSet;

    public String generateHs256SignedToken(UserDetails userDetails) {

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(userDetails.getUsername())
            .expirationTime(new Date(new Date().getTime() + expirationMinutes * 60 * 1000))
            .claim(ROLES_FIELD, getRoles(userDetails))
            .build();

        SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);

        try {
            jwt.sign(new MACSigner(jwtSecret));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }

        return jwt.serialize();
    }

    @SuppressWarnings("unchecked")
    public UsernamePasswordAuthenticationToken getUser(String token) {

        SignedJWT jwt;

        try {
            jwt = SignedJWT.parse(token);
        } catch (ParseException e) {
            throw new TokenException();
        }

        verifyTokenSignature(jwt);

        JWTClaimsSet claimsSet;

        try {
            claimsSet = jwt.getJWTClaimsSet();
        } catch (ParseException e) {
            throw new TokenException();
        }

        verifyTokenNotExpired(claimsSet);

        String subject = claimsSet.getSubject();
        List<String> roles = (List<String>) claimsSet.getClaim(ROLES_FIELD);

        return new UsernamePasswordAuthenticationToken(subject, null, getAuthorities(roles));

    }

    private List<String> getRoles(UserDetails userDetails) {

        List<String> roles = new ArrayList<>();

        if(userDetails.getAuthorities() != null) {
            userDetails.getAuthorities().forEach((authority) -> roles.add(authority.getAuthority()));
        }

        return roles;
    }

    void verifyTokenSignature(SignedJWT jwt) {

        JWSVerifier tokenVerifier;
        boolean isValid;
        String signingAlgorithmName = jwt.getHeader().getAlgorithm().getName();

        if (JWSAlgorithm.HS256.getName().equals(signingAlgorithmName)) {
            tokenVerifier = getHs256Verifier();
        } else if (JWSAlgorithm.RS256.getName().equals(signingAlgorithmName)) {
            tokenVerifier = getRs256Verifier(jwt.getHeader().getKeyID());
        } else {
            throw new TokenException();
        }

        try {
            isValid = jwt.verify(tokenVerifier);
        } catch (Exception e) {
            throw new TokenException();
        }

        if (!isValid) {
            throw new TokenException();
        }

    }

    private void verifyTokenNotExpired(JWTClaimsSet claimsSet) {

        Date now =  new Date();

        if (now.after(claimsSet.getExpirationTime())) {
            throw new TokenException();
        }

    }

    private JWSVerifier getHs256Verifier() {

        try {
            return new MACVerifier(jwtSecret);
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }

    }

    private JWSVerifier getRs256Verifier(String keyId) {

        if (jwkSet == null) { // jwkSet was never cached.
            loadJwkSet();
        }

        JWK jwk = jwkSet.getKeyByKeyId(keyId);

        if (jwk == null) {
            throw new TokenException();
        }

        try {
            return new RSASSAVerifier((RSAKey) jwk);
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }

    }

    private void loadJwkSet() {

        try {
            jwkSet = JWKSet.load(new URL(jwksEndPointUrl));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    private List<SimpleGrantedAuthority> getAuthorities(List<String> roles) {

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        for (String role : roles) {
            authorities.add(new SimpleGrantedAuthority(role));
        }

        return authorities;

    }

}
