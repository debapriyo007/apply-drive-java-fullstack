package com.jobportal.service.infrastructure;

import com.jobportal.dto.job.JobEvent;
import com.jobportal.service.infrastructure.RealTimeSyncService;
import org.springframework.stereotype.Service;

@Service
public class RealTimeSyncServiceImpl implements RealTimeSyncService {

    @Override
    public void publishJobEvent(JobEvent event) {
        // No-op: Real-time messaging (Redis/WebSockets) reserved for future implementation
    }
}