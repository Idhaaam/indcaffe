package com.indcaffe.controller;

import com.indcaffe.dto.AuthRequest;
import com.indcaffe.dto.AuthResponse;
import com.indcaffe.dto.RegisterRequest;
import com.indcaffe.entity.Cafe;
import com.indcaffe.entity.Mitra;
import com.indcaffe.entity.Role;
import com.indcaffe.entity.User;
import com.indcaffe.repository.CafeRepository;
import com.indcaffe.repository.MitraRepository;
import com.indcaffe.repository.UserRepository;
import com.indcaffe.security.JwtUtil;
import com.indcaffe.entity.Pelanggan;
import com.indcaffe.entity.Category;
import com.indcaffe.repository.PelangganRepository;
import com.indcaffe.repository.CategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CafeRepository cafeRepository;
    private final MitraRepository mitraRepository;
    private final CategoryRepository categoryRepository;
    private final PelangganRepository pelangganRepository;
    private final com.indcaffe.repository.AuditLogRepository auditLogRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/init-all")
    public ResponseEntity<?> initAll() {
        String[] usernames = {"cafe_demo", "admin_demo", "mitra_demo", "pelanggan_demo"};
        Role[] roles = {Role.CAFE, Role.ADMIN, Role.MITRA, Role.PELANGGAN};

        for (int i = 0; i < usernames.length; i++) {
            if (!userRepository.existsByUsername(usernames[i])) {
                User user = User.builder()
                        .username(usernames[i])
                        .password(encoder.encode("password123"))
                        .role(roles[i])
                        .isActive(true)
                        .isApproved(true)
                        .build();
                userRepository.save(user);

                if (roles[i] == Role.CAFE) {
                    Cafe cafe = Cafe.builder().user(user).name("Cafe Demo").address("Jl. Demo").city("Jakarta").build();
                    cafeRepository.save(cafe);
                } else if (roles[i] == Role.MITRA) {
                    Mitra mitra = Mitra.builder().user(user).name("Mitra Demo").city("Jakarta").build();
                    mitraRepository.save(mitra);
                }
            }
        }
        return ResponseEntity.ok("All test accounts created successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateJwtToken(authentication);

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User Not Found"));

            Long cafeId = null;
            Long mitraId = null;
            Long pelangganId = null;
            String name = "";
            String city = "";
            String address = "";

            if (user.getRole() == Role.CAFE) {
                Cafe cafe = cafeRepository.findByUserId(user.getId()).orElse(null);
                if (cafe != null) {
                    cafeId = cafe.getId();
                    name = cafe.getName();
                    city = cafe.getCity();
                    address = cafe.getAddress();
                }
            } else if (user.getRole() == Role.MITRA) {
                Mitra mitra = mitraRepository.findByUserId(user.getId()).orElse(null);
                if (mitra != null) {
                    mitraId = mitra.getId();
                    name = mitra.getName();
                    city = mitra.getCity();
                    address = mitra.getOrganizationType();
                }
            } else if (user.getRole() == Role.PELANGGAN) {
                Pelanggan pelanggan = pelangganRepository.findByUserId(user.getId()).orElse(null);
                if (pelanggan != null) {
                    pelangganId = pelanggan.getId();
                    name = pelanggan.getNamaLengkap();
                    address = pelanggan.getAlamat();
                }
            }

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .id(user.getId())
                    .cafeId(cafeId)
                    .mitraId(mitraId)
                    .pelangganId(pelangganId)
                    .name(name)
                    .city(city)
                    .address(address)
                    .username(user.getUsername())
                    .role(user.getRole())
                    .build());
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(java.util.Map.of(
                "message", "Username atau Password salah (atau Anda belum mendaftar)!"
            ));
        }
    }

    @PostMapping("/init-admin")
    public ResponseEntity<?> initAdmin(@Valid @RequestBody com.indcaffe.dto.InitAdminRequest request) {
        if (userRepository.count() > 0) {
            return ResponseEntity.status(403).body(java.util.Map.of("message", "Sistem sudah diinisialisasi"));
        }

        User admin = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        com.indcaffe.entity.AuditLog log = new com.indcaffe.entity.AuditLog();
        log.setAction("INIT_ADMIN");
        log.setEntityName("USER");
        log.setEntityId(admin.getId());
        log.setNewValue("Inisialisasi admin pertama: " + request.getUsername());
        log.setTimestamp(java.time.LocalDateTime.now());
        log.setUserId(admin.getId());
        auditLogRepository.save(log);

        return ResponseEntity.ok(java.util.Map.of("message", "Admin berhasil diinisialisasi"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if ("PELANGGAN".equalsIgnoreCase(signUpRequest.getType())) {
            if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Email wajib diisi untuk Pelanggan.");
            }
            if (pelangganRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email sudah terdaftar!");
            }
            if (signUpRequest.getNamaLengkap() == null || signUpRequest.getNamaLengkap().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Nama lengkap wajib diisi untuk Pelanggan.");
            }
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .password(encoder.encode(signUpRequest.getPassword()))
                .build();

        if ("CAFE".equalsIgnoreCase(signUpRequest.getType())) {
            user.setRole(Role.CAFE);
            User savedUser = userRepository.save(user);

            Cafe cafe = new Cafe();
            cafe.setName(signUpRequest.getName());
            cafe.setCity(signUpRequest.getCity());
            cafe.setAddress(signUpRequest.getAddress());
            cafe.setUser(savedUser);
            cafeRepository.save(cafe);

            // Create a default Category for the Cafe
            Category defaultCategory = new Category();
            defaultCategory.setName("Umum");
            defaultCategory.setCafe(cafe);
            categoryRepository.save(defaultCategory);

            return ResponseEntity.ok("User registered successfully!");
        } else if ("MITRA".equalsIgnoreCase(signUpRequest.getType())) {
            user.setRole(Role.MITRA);
            user = userRepository.save(user);

            Mitra mitra = Mitra.builder()
                    .name(signUpRequest.getName())
                    .city(signUpRequest.getCity())
                    .organizationType(signUpRequest.getOrganizationType())
                    .user(user)
                    .build();
            mitraRepository.save(mitra);
        } else if ("PELANGGAN".equalsIgnoreCase(signUpRequest.getType())) {
            user.setRole(Role.PELANGGAN);
            user = userRepository.save(user);

            Pelanggan pelanggan = Pelanggan.builder()
                    .namaLengkap(signUpRequest.getNamaLengkap())
                    .email(signUpRequest.getEmail())
                    .noTelpon(signUpRequest.getNoTelpon())
                    .alamat(signUpRequest.getAddress())
                    .user(user)
                    .build();
            pelangganRepository.save(pelanggan);
        } else {
            return ResponseEntity.badRequest().body("Error: Role tidak valid. Registrasi publik hanya untuk CAFE, MITRA, atau PELANGGAN.");
        }

        return ResponseEntity.ok("User registered successfully!");
    }
}
