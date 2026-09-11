import { SocietalDomain } from './types';

export interface SampleCase {
  id: string;
  domain: SocietalDomain;
  domainLabel: string;
  title: string;
  shortDesc: string;
  rawIntent: string;
  jurisdiction: string;
  urgencyLevel: 'low' | 'moderate' | 'critical' | 'emergency';
  additionalContext: string;
}

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'housing-eviction',
    domain: 'housing_tenancy',
    domainLabel: 'Housing & Tenancy',
    title: 'Arbitrary Renovation Eviction Notice',
    shortDesc: 'Landlord giving 7-day informal move-out text for renovations.',
    rawIntent:
      'My landlord sent me a text message saying we have 7 days to pack up and vacate because they want to renovate the units. We have paid all our rent on time for 4 years, have a lease that runs for 6 more months, and my 74-year-old mother is recovering from hip surgery in our apartment.',
    jurisdiction: 'Cook County, Illinois (Chicago)',
    urgencyLevel: 'critical',
    additionalContext:
      'The landlord has not served any formal written notice to quit or court summons. They threatened to change the locks next Monday.',
  },
  {
    id: 'healthcare-surprise-billing',
    domain: 'healthcare_billing',
    domainLabel: 'Healthcare & Insurance',
    title: 'Surprise Out-of-Network Emergency Bill',
    shortDesc: '$14,800 emergency surgery bill sent to collections.',
    rawIntent:
      'I was rushed to the nearest emergency room for acute appendicitis and had emergency surgery. My in-network health plan pre-authorized the ER admission, but 3 months later the assistant surgeon sent me a surprise balance bill for $14,800 claiming they were out-of-network. Now a collection agency is calling me daily.',
    jurisdiction: 'United States (Federal No Surprises Act & State Insurance Commissioner)',
    urgencyLevel: 'critical',
    additionalContext:
      'I never chose the assistant surgeon, nor did I receive any prior cost disclosure or consent form before emergency surgery.',
  },
  {
    id: 'civic-drinking-water',
    domain: 'civic_environment',
    domainLabel: 'Civic & Environmental',
    title: 'Neighborhood Water Contamination Escalation',
    shortDesc: 'Municipal water smells chemical, children developed rashes.',
    rawIntent:
      'The tap water in our 300-home subdivision has smelled like gasoline and rotten eggs for two weeks. Several children and pets developed stomach illnesses and rashes. When we called the local municipal utility board, they said it was just seasonal turnover and refused to perform third-party lab testing.',
    jurisdiction: 'Ohio River Valley District / EPA Region 5',
    urgencyLevel: 'emergency',
    additionalContext:
      'Neighbors have photos of yellow-tinted water and independent water test kits showing volatile organic compounds above EPA maximum contaminant levels (MCL).',
  },
  {
    id: 'disability-appeal',
    domain: 'disability_benefits',
    domainLabel: 'Disability & Social Benefits',
    title: 'SSDI Procedural Denial Appeal',
    shortDesc: 'Disability claim denied over administrative coding discrepancy.',
    rawIntent:
      'My Social Security Disability (SSDI) application for degenerative disc disease was denied after waiting 11 months. The denial notice stated I failed to submit consultative examination records, but my primary physician faxed the full 200-page file twice with transmission receipts.',
    jurisdiction: 'Social Security Administration (Regional Appeals Council)',
    urgencyLevel: 'moderate',
    additionalContext:
      'I have 30 days remaining on my 60-day window to file Form SSA-561 (Request for Reconsideration) and Form SSA-3441.',
  },
  {
    id: 'community-food-rescue',
    domain: 'small_business_licensing',
    domainLabel: 'Community & Food Security',
    title: 'Mutual Aid Surplus Food Rescue Protection',
    shortDesc: 'City threatened volunteer food rescue group with $5,000 fine.',
    rawIntent:
      'Our volunteer group rescues prepared, unserved surplus meals from hotel banquets and delivers them to local family shelters within 2 hours in temperature-controlled cambros. A city health inspector warned us that we will be cited with a $5,000 misdemeanor violation for distributing unpermitted food.',
    jurisdiction: 'Municipal Code & Federal Bill Emerson Good Samaritan Food Donation Act',
    urgencyLevel: 'moderate',
    additionalContext:
      'All food is kept at food-safe temperatures (>140°F or <40°F), logged on thermal logs, and all volunteers hold certified food handler cards.',
  },
];
