package com.jobportal.service.impl;

import com.jobportal.dto.response.JobEvent;
import com.jobportal.service.RealTimeSyncService;
import org.springframework.stereotype.Service;

@Service
public class RealTimeSyncServiceImpl implements RealTimeSyncService {

    @Override
    public void publishJobEvent(JobEvent event) {
        // No-op: Real-time messaging (Redis/WebSockets) reserved for future implementation
    }
}