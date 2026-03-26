package com.example.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.entity.User;
import com.example.demo.dto.SignupRequest;
import com.example.demo.repository.UserRepository;

@Service
public class SignupService {
    private final UserRepository ur;
    private PasswordEncoder passwordEncoder;
   public SignupService(UserRepository ur,PasswordEncoder passwordEncoder){
     this.ur=ur;
     this.passwordEncoder=passwordEncoder;
    }

    public String sighnup(SignupRequest request){
      User u=new User();
      u.setFullname(request.getFullname());
      u.setEmail(request.getEmail());
      u.setPassword(passwordEncoder.encode(request.getPassword()));
      User savedUser = ur.save(u);
      if(savedUser!=null){
         return "user registered successfully";
      }
      else{
        return "registeration  unsuccessfully";
      }
      
    }

}
