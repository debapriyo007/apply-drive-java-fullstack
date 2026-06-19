package com.jobportal.config;

import com.jobportal.entity.Admin;
import com.jobportal.entity.Role;
import com.jobportal.entity.Company;
import com.jobportal.entity.Category;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobStatus;
import com.jobportal.repository.AdminRepository;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * DatabaseInitializer — runs automatically once on every application startup.
 * Seeding is idempotent — only inserts what is missing.
 */
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;
    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== DatabaseInitializer: Checking seed data ===");

        // Step 1: Ensure all required roles exist
        Role userRole      = seedRole("ROLE_USER");
        Role adminRole     = seedRole("ROLE_ADMIN");
        Role superAdminRole = seedRole("ROLE_SUPER_ADMIN");

        // Step 2: Ensure a default Super Admin account exists
        if (!adminRepository.existsByEmail("admin@portal.com")) {
            log.info("No super admin found. Creating default admin (admin@portal.com / admin123)...");

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(superAdminRole);

            Admin admin = new Admin();
            admin.setFullName("Default Super Admin");
            admin.setEmail("admin@portal.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(roles);
            admin.setIsActive(true);

            adminRepository.save(admin);
            log.info("Default Super Admin created successfully.");
        } else {
            log.info("Super Admin already exists. Skipping seed.");
        }

        // Step 3: Seed Scraped Off-Campus Jobs
        seedScrapedJobs();
    }

    private Role seedRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    log.info("Seeding missing role: {}", roleName);
                    return roleRepository.save(Role.builder().name(roleName).build());
                });
    }

    private void seedScrapedJobs() {
        log.info("Seeding scraped off-campus jobs...");
            seedJob(
                "Zensar Hiring 2026/2025 Batch – Off Campus",
                "Zensar",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nAt Zensar, we’re “experience-led everything”. We are committed to conceptualizing, designing, engineering, marketing, and managing digital solutions and experiences for over 130 leading enterprises. We are a company driven by a bold purpose: Together, we shape experiences for better futures. Whether for our clients, our people, or the world around us, this belief powers everything we do. At the heart of our culture is ONE with Client – a set of four core values that reflect who we are and how we work: One Zensar, Nurturing, Empowering, and Client Focus.\n\nClearly communicate and present ideas, outcomes and system behaviors to technical and non-technical stakeholders\n\nCopyright © 2026 KN Academy Jobs\n\n• BE/B tech – Computer Science – 2025 / 2026 Pass out\n\n• Candidate should have a Strong Pedigree.",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://fa-etvl-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/145691/",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "CDAC Hiring – Openings – PAN INDIA",
                "CDAC",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nCentre for Development of Advanced Computing (C-DAC), is a Scientific Society of the Ministry of Electronics and Information Technology, Government of India. C-DAC has today emerged as a premier R&D organization in ICT&E (Information, Communications Technologies and Electronics) in the country, working on strengthening national technological capabilities in the context of global developments in the field and responding to change in the market need in selected foundation areas. C-DAC represents a unique facet working in close junction with MeitY to implement nation’s policy and pragmatic interventions and initiatives in Information Technology. As an institution for high-end Research and Development (R&D), C-DAC has been at the forefront of the Information, Communications Technologies and Electronics (ICT&E) revolution, constantly building capacities in emerging/enabling technologies and innovating and leveraging its expertise, caliber and skill sets to develop and deploy products and solutions for different sectors of the economy.\n\nC-DAC’s areas of expertise range from R&D work in ICT&E Technologies to Product Development, IP Generation, Technology Transfer and Deployment of Solutions. Primary Thematic or Thrust Areas and Mission Mode programmes addressed by C-DAC are:\n\nCopyright © 2026 KN Academy Jobs\n\n• Basic knowledge of frontend and backend development, HTML, CSS, JavaScript, React.js, Node.js, database fundamentals (MongoDB/MySQL), Git/GitHub, API integration, and understanding of SDLC and Agile methodologies.\n\n• Frontend Development using React.js, HTML, CSS, JavaScript/TypeScript. Backend Development using Node.js, Java/Spring Boot, or Python. Database design and management using MongoDB, MySQL, PostgreSQL, or other RDBMS. Cloud deployment and services knowledge on AWS/Azure/GCP. Understanding of REST APIs, Microservices Architecture, Docker, Kubernetes, Git/GitHub, CI/CD pipelines, and SDLC methodologies (Agile/Scrum).",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://careers.cdac.in/",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "HirePro Hackvega 2.0 | Hiring Contest",
                "HirePro",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nHackVega is back, looking for the brightest star of tech brilliance!\n\nTake the stage at Momentum’26\n\nTop performers will be recognized at HirePro’s Momentum’26, India’s largest conference of industry and academia leaders. It is an opportunity to be seen by key decision-makers across tech, talent, and academia, all in one place. \n\nRepresent your campus on a national stage\n\nThe three best-performing institutions will be recognized at Momentum’26, based on participation, performance, and consistency across the hackathon. It is a chance to put your college in the spotlight among the best in the country.",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://mycareernet.co/mycareernet/contests/HirePro-HackVega-2-0--288",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Purpple Tech Hiring Challenge 2026",
                "Purpple Tech",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nAt Purplle, We’re looking for builders. The kind who don’t just solve problems — they rethink them.\n\nThe Purplle Tech Challenge isn’t a test. It’s a real problem, pulled from how our users experience beauty every day.\n\nYou’ll build with real data, real scale, and real impact in mind.\n\nIf creating AI that touches millions sounds like your kind of challenge — you’re in the right place.\n\n1. Who is eligible to participate in the Purplle Tech Challenge?",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://www.hackerearth.com/community/challenges/competitive/purplle-tech-challenge/",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Accenture Hiring Challenge – Freshers CSR",
                "Accenture",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nAll that you need to know about Accenture Customer Service Representative Hiring Challenge\n\nBe the voice that makes a difference: Build a career in Customer Service\n\nReady to reinvent how customer experiences are delivered? Here’s your moment to shine.\n\nWhen we launched Be the voice that makes a difference last year, thousands of students and early-career professionals from across India answered the call—not just to compete, but to reinvent customer service itself. What followed was a showcase of sharp thinking, real empathy and bold ideas in action. And for some, that moment changed everything—turning potential into opportunity, with top performers fast-tracked into careers at Accenture Operations.\n\nNow, it’s your turn to step into the spotlight",
                "Best in Industry",
                "Freshers (0-2 years)",
                "PAN India",
                "ONSITE",
                "https://unstop.com/competitions/crp-accenture-customer-service-representative-hiring-challenge-accenture-1673256?lb=ZklSFu8&utm_medium=Share&utm_source=competitions&utm_campaign=Prafusha5561",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Tata Steel – Hackathon | Hiring 2026",
                "Tata Steel",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nThe Tata Steel AI Hackathon 2026 is a talent discovery initiative designed to engage high‑potential Artificial Intelligence and Machine Learning professionals through real‑world industrial problem solving. Participants will work on  problem statements from the industry, progressing through a structured multi‑stage journey that includes an online challenge, advanced technical evaluations, and a final round designed to assess depth of expertise, analytical thinking, and the ability to translate AI solutions into business‑relevant outcomes. The hackathon experience emphasizes practical application, innovation, and meaningful engagement with complex AI use cases within an industrial ecosystem.\n\nOutstanding participants will be recognized through a range of growth‑oriented opportunities. These include Pre‑Placement Interview (PPI) opportunities with Tata Steel along with joining bonuses  and mentorship from Tata Steel’s industry leaders, offering valuable exposure to large‑scale AI implementations and strategic decision‑making.\n\nThe Tata Steel AI Hackathon 2026 offers participants not just a competitive platform, but a chance to learn, showcase expertise, and engage with real challenges that reflect the future of AI in industry. By combining rigorous technical evaluation with meaningful recognition and mentorship, the hackathon aims to create a high‑impact learning journey and a strong community of AI practitioners aligned with innovation, excellence, and long‑term impact.\n\nOne of the most diversified integrated steel producers with a capacity of 35 million tonnes per annum across India, the Netherlands, the UK, and Thailand, Tata Steel is shaping a better tomorrow through innovation, sustainability, and an enduring commitment to excellence. The Company’s Jamshedpur, Kalinganagar and IJmuiden plants have been recognised among the World Economic Forum Advanced 4th Industrial Revolution (4IR) Global Lighthouses. With over 76,000 employees across the globe, Tata Steel is a Great Place to Work®-certified organisation. The Company recorded a consolidated turnover of approximately US$26 billion in the financial year ending March 31, 2025.\n\nCopyright © 2026 KN Academy Jobs",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://www.hackerearth.com/community/challenges/competitive/tata-steel-ai-hackathon/",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Sutherland Hiring SDET Fresher 2026",
                "Sutherland",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nArtificial Intelligence. Automation. Cloud engineering. Advanced analytics. For business leaders, these are key factors of success. For us, they’re our core expertise.\n\nWe work with iconic brands worldwide. We bring them a unique value proposition through market-leading technology and business process excellence.\n\nWishing you all the best in your placement journey.\n\nCopyright © 2026 KN Academy Jobs\n\n• Our most successful candidates will have: – Academic: BE / BTECH (CSE, IT), B.Sc. (Computers), BCA / MCA Or Other Bachelor / Master’s Degree in Computing / IT preferred – Functional Domain: Healthcare IT / IT Services Delivery domain.",
                "Best in Industry",
                "Freshers (0-2 years)",
                "PAN India",
                "ONSITE",
                "https://jobs.smartrecruiters.com/Sutherland/744000124876809-software-engineer-development-or-testing?utm_source=commonjobs&utm_medium=referral&utm_campaign=job_listing",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "CSG Hiring Systems Administrator Grad 2026",
                "CSG",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nAt CSG, you’re more than your resume. We want your diverse perspective and unique background to help us enrich the work we do together. We believe that by channelling the power of all, we make ordinary customer and employee experiences extraordinary.\n\nThis is your opportunity to join one of our high-performing teams. Channel the power of YOU and begin the journey to becoming a CSGer.\n\nWishing you all the best in your placement journey.\n\nCopyright © 2026 KN Academy Jobs\n\n• Bachelor’s degree in computer science, Software Engineering, or related field, or equivalent practical experience.",
                "Best in Industry",
                "Freshers (0-2 years)",
                "PAN India",
                "ONSITE",
                "https://csgi.wd5.myworkdayjobs.com/CSGCareers/job/India-Remote/Systems-Administrator-Grad_31901",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Odoo Hackathon – Hiring Challenge",
                "Odoo",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nOdoo India’s hackathons are open challenge to all tech enthusiasts and a great tool for Odoo to hire best coders and designers to join Odoo India’s growing team. \n\nOdoo India’s hiring hackathon journey began in June 2024 with Odoo Combat, our first open recruitment hackathon, attracting over 3,000 students and discovering exceptional young developers. Encouraged by its success, Odoo India collaborated with leading universities to bring hackathons closer to emerging talent, transforming a simple idea into a nationwide hackathon series.\n\nToday, Odoo India has replaced traditional campus placements with hiring hackathons. \n\nWishing you all the best in your placement journey.\n\nCopyright © 2026 KN Academy Jobs",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://hackathon.odoo.com/",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Mthree Hiring – Off Campus Drive",
                "Mthree",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nmthree gives you a foot in the door to your dream career!\n\nWe’ve helped 4,000 people start careers in technology, banking and business. For graduates and anyone starting their career, you’ll start with 6-12 weeks of training at our Academy. Then you’ll join one of our clients for 12-24 months (we work with investment banks and other big companies in industries from healthcare to aviation to insurance).\n\nYou’re supported by us throughout, with pay rises every 12 months and an online learning plan to develop your skills. Afterwards, the majority continue their career with the client.   \n\nAt mthree, we believe in fairness from the start. We don’t lock you in with exit fees. You’ll never have to pay a thing.\n\nJoin mthree to unlock your potential and go further than you thought possible.",
                "Best in Industry",
                "0-2 Years",
                "PAN India",
                "ONSITE",
                "https://job-boards.greenhouse.io/mthreerecruitingportal/jobs/4660235006",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Mahindra Mass Hiring For Fresher 2026",
                "Mahindra",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nMahindra and Mahindra Automotive and Farm Sector is inviting applications from engineering students graduating in 2026 for its trainee programs.This initiative is designed to give early-career engineers a meaningful start, with opportunities to work on real-world projects, collaborate with experienced teams, and build a strong foundation within their engineering ecosystem.\n\nKindly fill out the registration form using the application link.\n\nAfter registration, your profile will be evaluated against the eligibility criteria, and the team will reach out to you regarding the next steps if you qualify.\n\nThe assessment will be conducted on the HirePro platform and will be an AI-proctored Multiple Select Question (MSQ) based test.\n\nShortlisted candidates from the assessment will proceed to an AI-proctored technical interview round.",
                "Best in Industry",
                "Freshers (0-2 years)",
                "PAN India",
                "ONSITE",
                "https://mycareernet.co/events/mahindra-campus-hiring-2026/?",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Infosys Hiring – SP / DSE (2026 Batch)",
                "Infosys",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nfosys is a global leader in next-generation digital services, consulting, and AI, founded in 1981 and headquartered in Bengaluru, India. With over 330,000 employees across 59 countries, it provides IT-enabled solutions, including AI-first core services, cloud, and agile digital transformation to clients. Infosys +3\n\nKey aspects of Infosys:\n\nInfosys is opening doors for skilled programmers to join at high-paying roles 💻✨🔥 Roles & CTC• Specialist Programmer L3 – ₹21 LPA• Specialist Programmer L2 – ₹16 LPA• Specialist Programmer L1 – ₹10 LPA + ₹1L Joining Bonus• Digital Specialist Engineer – ₹6.25 LPA + ₹75K Joining Bonus🎓 Eligible CoursesBE / BTech / ME / MTech / MCA / MSc (5-year integrated)🧠 Eligible Branches (Important 👇)• CSE / IT• Data Science / AI / ML• Cybersecurity / Software Engineering• Electronics & Communication Engineering (ECE)• Electronics & Electrical Engineering (EEE) ⚡\n\nWishing you all the best in your placement journey.\n\nCopyright © 2026 KN Academy Jobs",
                "Best in Industry",
                "0-2 Years",
                "Bangalore",
                "ONSITE",
                "https://surveys.infosysapps.com/r/a/SPOffCampusregistration_apr26",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
    
            seedJob(
                "Thinkitive Mass Hiring Announced Freher 2026",
                "Thinkitive",
                "Welcome to KN Academy Jobs, the premier online job portal for off campus job opportunities. Our mission is to connect talented job seekers with top employers and help them find the perfect fit for their career goals. We Put Latest OFF Campus Job Drives on Our Channel.\n\nWe Provide Recent OFF Campus Hiring Drives For 2020/2021/2022/2023/2024/2025 Batch Students. The Domain in Which We Cover Hirings Are Software Engineering , Data Analysis , Web Development\n\nOff-campus hiring allows companies to reach a wider pool of candidates and gives job seekers the opportunity to showcase their skills and qualifications to a wider range of employers. Companies can conduct off-campus hiring events, virtual recruitment drives, or use job portals and social media to reach potential candidates.\n\nThinkitive is a technology company and solution provider of the next-gen business teams up with clients worldwide. With remarkable experience, a comprehensive system over differing enterprises and areas, we work with clients to transform them into some of the most fruitful and elite organizations. Incepted in 2015, Thinkitive is headquartered in Pune, India. Our commitment to delivering cost-effective, high quality and result-oriented IT solutions to global businesses.\n\nWishing you all the best in your placement journey.\n\nCopyright © 2026 KN Academy Jobs\n\n• Strong Communication & Interpersonal Skills OOPs & Data Structures Front-End HTML/CSS & Javascript Basics Database – SQL/ No-SQL\n\n• Strong problem-solving skills Should be a quick learner",
                "Best in Industry",
                "0-2 Years",
                "Pune",
                "ONSITE",
                "https://www.thinkitive.com/company/trainee-software-engineer-job-description.html",
                new String[]{"Off-Campus Jobs", "Full Time Jobs"}
            );
        log.info("Scraped jobs checking/seeding complete.");
    }

    private void seedJob(String title, String companyName, String description, String salary, String experience, String location, String jobType, String officialApplyUrl, String[] categoryNames) {
        if (jobRepository.existsByTitle(title) || jobRepository.existsByOfficialApplyUrl(officialApplyUrl)) {
            return;
        }

        Company company = companyRepository.findByName(companyName)
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(companyName)
                        .logoUrl("https://logo.clearbit.com/" + companyName.toLowerCase().replace(" ", "") + ".com")
                        .websiteUrl("https://www." + companyName.toLowerCase().replace(" ", "") + ".com")
                        .description("Partner company " + companyName)
                        .build()));

        Set<Category> categories = new HashSet<>();
        for (String catName : categoryNames) {
            Category category = categoryRepository.findByName(catName)
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .name(catName)
                            .slug(catName.toLowerCase().replace(" ", "-"))
                            .build()));
            categories.add(category);
        }

        Admin superAdmin = adminRepository.findByEmail("admin@portal.com").orElse(null);

        Job job = Job.builder()
                .title(title)
                .company(company)
                .description(description)
                .salary(salary)
                .experience(experience)
                .location(location)
                .jobType(jobType)
                .officialApplyUrl(officialApplyUrl)
                .postedDate(LocalDate.now())
                .status(JobStatus.ACTIVE)
                .createdBy(superAdmin)
                .categories(categories)
                .build();

        jobRepository.save(job);
        log.info("Seeded job: {}", title);
    }
}
