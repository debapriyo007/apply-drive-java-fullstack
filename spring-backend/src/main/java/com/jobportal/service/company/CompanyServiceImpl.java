package com.jobportal.service.company;

import com.jobportal.dto.company.CompanyDto;
import com.jobportal.entity.Company;
import com.jobportal.entity.Job;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.mapper.DtoMapper;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.service.company.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final DtoMapper dtoMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(dtoMapper::toCompanyDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return dtoMapper.toCompanyDto(company);
    }

    @Override
    @Transactional
    public CompanyDto createCompany(CompanyDto dto) {
        Company company = dtoMapper.toCompany(dto);
        return dtoMapper.toCompanyDto(companyRepository.save(company));
    }

    @Override
    @Transactional
    public CompanyDto updateCompany(Long id, CompanyDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        company.setName(dto.getName());
        company.setLogoUrl(dto.getLogoUrl());
        company.setWebsiteUrl(dto.getWebsiteUrl());
        company.setDescription(dto.getDescription());
        return dtoMapper.toCompanyDto(companyRepository.save(company));
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found with id: " + id);
        }
        List<Job> companyJobs = jobRepository.findByCompanyId(id);
        for (Job job : companyJobs) {
            savedJobRepository.deleteByJobId(job.getId());
        }
        jobRepository.deleteAll(companyJobs);
        companyRepository.deleteById(id);
    }
}