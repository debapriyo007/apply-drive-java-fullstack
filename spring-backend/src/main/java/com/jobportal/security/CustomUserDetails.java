package com.jobportal.security;

import com.jobportal.entity.Admin;
import com.jobportal.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * CustomUserDetails wraps a User or Admin entity and adapts it to
 * Spring Security's UserDetails interface. Stored in the SecurityContext
 * after successful JWT authentication.
 *
 * NOTE: No Lombok here — UserDetails interface has getPassword() and
 * getUsername() which conflict with Lombok @Getter on 'password'/'email'
 * fields. We implement everything manually (explicit getters).
 */
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String fullName;
    private final boolean isAdmin;
    private final Collection<? extends GrantedAuthority> authorities;

    private CustomUserDetails(Long id, String email, String password, String fullName,
                               boolean isAdmin, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.isAdmin = isAdmin;
        this.authorities = authorities;
    }

    // ─── Factory methods ──────────────────────────────────────────────────────

    public static CustomUserDetails fromUser(User user) {
        Collection<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
        return new CustomUserDetails(user.getId(), user.getEmail(), user.getPassword(),
                user.getFullName(), false, authorities);
    }

    public static CustomUserDetails fromAdmin(Admin admin) {
        Collection<GrantedAuthority> authorities = admin.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
        return new CustomUserDetails(admin.getId(), admin.getEmail(), admin.getPassword(),
                admin.getFullName(), true, authorities);
    }

    // ─── Custom getters ────────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    // ─── UserDetails interface ─────────────────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}