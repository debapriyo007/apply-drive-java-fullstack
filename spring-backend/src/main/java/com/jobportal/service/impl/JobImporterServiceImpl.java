package com.jobportal.service.impl;

import com.jobportal.dto.response.JobImportDto;
import com.jobportal.service.JobImporterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JobImporterServiceImpl implements JobImporterService {

    private static final Logger log = LoggerFactory.getLogger(JobImporterServiceImpl.class);

    @Override
    public JobImportDto parseJobPost(String rawText) {
        log.info("Starting AI Regex parsing for raw job post text...");

        String companyName = "Unknown Company";
        String jobTitle = "Unknown Title";
        String location = "Remote / India";
        String salary = "Not Disclosed";
        String applyLink = "";

        // Normalize text lines
        String cleanText = rawText.replaceAll("(?i)\\*+", "").trim(); // Remove markdown bold asterisks

        // 1. Match Company Name & Job Title
        Pattern titlePattern = Pattern.compile("(?i)(?:^|\\n)(?:hiring|role|position|job)?:?\\s*([a-zA-Z0-9\\s]{2,40})\\s+(?:hiring|is hiring|hiring for)\\s+([a-zA-Z0-9\\s]{2,40})");
        Matcher titleMatcher = titlePattern.matcher(cleanText);
        if (titleMatcher.find()) {
            companyName = titleMatcher.group(1).trim();
            jobTitle = titleMatcher.group(2).trim();
        } else {
            Pattern altTitlePattern = Pattern.compile("(?i)^([a-zA-Z0-9\\s]{2,30})\\s+(?:hiring|role|position)\\s*:?\\s*([a-zA-Z0-9\\s/]{2,40})");
            Matcher altTitleMatcher = altTitlePattern.matcher(cleanText);
            if (altTitleMatcher.find()) {
                companyName = altTitleMatcher.group(1).trim();
                jobTitle = altTitleMatcher.group(2).trim();
            } else {
                String[] lines = cleanText.split("\\n");
                if (lines.length > 0 && lines[0].contains(" Hiring ")) {
                    String[] parts = lines[0].split(" Hiring ");
                    companyName = parts[0].trim();
                    jobTitle = parts[1].trim();
                } else if (lines.length > 0 && lines[0].contains("-")) {
                    String[] parts = lines[0].split("-");
                    companyName = parts[0].trim();
                    jobTitle = parts[1].trim();
                } else if (lines.length > 0) {
                    companyName = lines[0].trim();
                }
            }
        }

        // 2. Match Location
        Pattern locationPattern = Pattern.compile("(?i)(?:location|loc|job location|work location)\\s*[:-]\\s*([a-zA-Z0-9\\s,]+)");
        Matcher locationMatcher = locationPattern.matcher(cleanText);
        if (locationMatcher.find()) {
            location = locationMatcher.group(1).trim();
        }

        // 3. Match Salary
        Pattern salaryPattern = Pattern.compile("(?i)(?:salary|ctc|package|pay|lpa)\\s*[:-]\\s*([a-zA-Z0-9\\s,.-]+(?:LPA|Lacs|Lakhs|CTC|Per Annum)?)");
        Matcher salaryMatcher = salaryPattern.matcher(cleanText);
        if (salaryMatcher.find()) {
            salary = salaryMatcher.group(1).trim();
        }

        // 4. Match Apply Link
        Pattern linkPattern = Pattern.compile("(?i)(?:apply|link|url|apply here|apply link)\\s*[:-]?\\s*(https?://\\S+)");
        Matcher linkMatcher = linkPattern.matcher(cleanText);
        if (linkMatcher.find()) {
            applyLink = linkMatcher.group(1).trim();
        } else {
            Pattern rawLinkPattern = Pattern.compile("(https?://\\S+)");
            Matcher rawLinkMatcher = rawLinkPattern.matcher(cleanText);
            if (rawLinkMatcher.find()) {
                applyLink = rawLinkMatcher.group(1).trim();
            }
        }

        return JobImportDto.builder()
                .companyName(companyName)
                .jobTitle(jobTitle)
                .location(location)
                .salary(salary)
                .applyLink(applyLink)
                .rawPostText(rawText)
                .build();
    }
}
