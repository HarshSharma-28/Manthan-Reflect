import { CrisisResource } from './types';

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: 'us-988',
    region: 'United States & Canada',
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or Text 988',
    description: 'Free, confidential support available 24/7 for anyone experiencing mental health distress or crisis.',
    type: 'phone',
    link: 'https://988lifeline.org',
    hours: '24/7 Available'
  },
  {
    id: 'us-crisis-text',
    region: 'United States & Canada / UK',
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741 (US/CA) or 85258 (UK)',
    description: 'Free 24/7 crisis support via SMS with trained crisis counselors.',
    type: 'text',
    link: 'https://www.crisistextline.org',
    hours: '24/7 Available'
  },
  {
    id: 'uk-samaritans',
    region: 'United Kingdom & Ireland',
    name: 'Samaritans',
    contact: 'Call 116 123',
    description: 'Round-the-clock listening service for anyone who is struggling to cope or needs someone to talk to.',
    type: 'phone',
    link: 'https://www.samaritans.org',
    hours: '24/7 Available'
  },
  {
    id: 'in-tele-manas',
    region: 'India',
    name: 'Tele-MANAS (Govt of India)',
    contact: 'Call 14416 or 1800-891-4416',
    description: 'Free 24/7 national tele-mental health helpline supported by Nimhans and Govt of India.',
    type: 'phone',
    link: 'https://telemanas.mohfw.gov.in',
    hours: '24/7 Multi-language'
  },
  {
    id: 'in-vandrevala',
    region: 'India / Global',
    name: 'Vandrevala Foundation Helpline',
    contact: '+91 9999 666 555',
    description: 'Free mental health support, crisis intervention and counseling across India and worldwide.',
    type: 'phone',
    link: 'https://www.vandrevalafoundation.com',
    hours: '24/7 Available'
  },
  {
    id: 'intl-befrienders',
    region: 'International / Worldwide',
    name: 'Befrienders Worldwide & IASP Directory',
    contact: 'Find your local crisis center',
    description: 'International directory of confidential emotional support and crisis hotlines worldwide.',
    type: 'web',
    link: 'https://www.befrienders.org',
    hours: 'Global Directory'
  }
];
