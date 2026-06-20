package com.jobportal.service.infrastructure;

import com.jobportal.dto.job.JobEvent;


public interface RealTimeSyncService {
    void publishJobEvent(JobEvent event);
}
