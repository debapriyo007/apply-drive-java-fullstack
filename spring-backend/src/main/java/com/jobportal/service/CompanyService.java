package com.jobportal.service;

import com.jobportal.dto.request.CompanyDto;

import java.util.List;

public interface CompanyService {
    List<CompanyDto> getAllCompanies();
    CompanyDto getCompanyById(Long id);
    CompanyDto createCompany(CompanyDto dto);
    CompanyDto updateCompany(Long id, CompanyDto dto);
    void deleteCompany(Long id);
}
