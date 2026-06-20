package com.jobportal.service.job;

import com.jobportal.dto.job.JobImportDto;


public interface JobImporterService {
    JobImportDto parseJobPost(String rawText);
}
