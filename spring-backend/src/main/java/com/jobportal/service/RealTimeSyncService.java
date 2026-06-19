package com.jobportal.service;

import com.jobportal.dto.response.JobEvent;


public interface RealTimeSyncService {
    void publishJobEvent(JobEvent event);
}
