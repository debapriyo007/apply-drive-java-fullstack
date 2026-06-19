package com.jobportal.service;

import com.jobportal.dto.response.JobImportDto;


public interface JobImporterService {
    JobImportDto parseJobPost(String rawText);
}
