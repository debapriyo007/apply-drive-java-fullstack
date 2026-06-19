package com.jobportal.service.impl;

import lombok.RequiredArgsConstructor;

import com.jobportal.service.CloudinaryService;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

        private final Cloudinary cloudinary;

    


    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        // Upload the bytes of the file, specifying the specific folder parameter
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "job_portal_uploads")
        );
        return uploadResult.get("secure_url").toString();
    }
}
