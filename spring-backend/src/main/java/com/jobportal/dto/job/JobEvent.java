package com.jobportal.dto.job;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class JobEvent {

    private String eventType;
    private Long jobId;
    private String jobTitle;

    public JobEvent(String eventType, Long jobId, String jobTitle) {
        this.eventType = eventType;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
    }
}