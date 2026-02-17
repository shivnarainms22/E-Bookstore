package com.onlinebookstore.util;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${jwt.secret}")
	private String SECRET;

	@Value("${jwt.expiration:3600000}") // Default 1 hour in milliseconds
	private Long jwtExpiration;

	public String extractUsername(String token)
	{
		return extractClaim(token,Claims::getSubject);
	}
	public Date extractExpiration(String token)
	{
		return extractClaim(token,Claims::getExpiration);
	}
	public <T> T extractClaim(String token, Function<Claims,T> claimsResolver)
	{
		final Claims claims=extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	public Claims extractAllClaims(String token)
	{
		return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
	}
	private Boolean isTokenExpired(String token)
	{
		return extractExpiration(token).before(new Date());
	}
	public Boolean validateToken(String token,UserDetails userDetails)
	{
		final String username=extractUsername(token);
		return(username.equals(userDetails.getUsername()) && !isTokenExpired(token)); 
	}

	
	 public String generateToken(Long userId, String userName, String role) {
	        Map<String, Object> claims = new HashMap<>();
	        claims.put("userId", userId); // Add userId to the token
	        claims.put("role", role);    // Add role to the token
	        return createToken(claims, userName);
	    }

	private String createToken(Map<String, Object> claims, String userName) {
	    return Jwts.builder()
	        .setClaims(claims)
	        .setSubject(userName)
	        .setIssuedAt(new Date(System.currentTimeMillis()))
	        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
	        .signWith(getSignKey(), SignatureAlgorithm.HS256)
	        .compact();
	}
	
	private Key getSignKey()
	{
		byte[] keyBytes=Decoders.BASE64.decode(SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}

