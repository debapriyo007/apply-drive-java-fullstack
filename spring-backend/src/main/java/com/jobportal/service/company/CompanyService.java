package com.jobportal.service.company;

import com.jobportal.dto.company.CompanyDto;

import java.util.List;

public interface CompanyService {
    List<CompanyDto> getAllCompanies();
    CompanyDto getCompanyById(Long id);
    CompanyDto createCompany(CompanyDto dto);
    CompanyDto updateCompany(Long id, CompanyDto dto);
    void deleteCompany(Long id);
}
