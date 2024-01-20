import matter from 'gray-matter';

const CACHE_TIME = 3600;
const GOAL_LABEL = 'Goal';

export interface IIssue {
  id: number;
  title: string;
  comments: number;
  updatedAt: string;
  createdAt: string;
  assignee: string | null;
  name: string | null;
  completedPercentage: number | null;
  amountCents: number | null;
  description: string | null;
}

export interface IGoals {
  complete: IIssue[];
  inProgress: IIssue[];
  planned: IIssue[];
  featuredFunded: IIssue;
  featuredUnfunded: IIssue;
}


export interface IGiteaIssue {
  id: number;
  title: string;
  body: string;
  comments: number;
  updated_at: string;
  created_at: string;
  assignee: string | null;
}

const bigHairyAudaciousGoal: IIssue = {
  id: 55234234,
  title: 'BHAG',
  comments: 0,
  updatedAt: '2023-09-20T08:54:01.373Z',
  createdAt: '2023-09-20T08:54:01.373Z',
  assignee: null,
  name: 'Big Hairy Audacious Goal',
  description: 'World domination!!!!!1',
  amountCents: 100000000,
  completedPercentage: 0.04
};

const defaultGoal: IIssue = {
  id: 55234233,
  title: 'e',
  comments: 0,
  updatedAt: '2023-09-20T08:54:01.373Z',
  createdAt: '2023-09-20T08:54:01.373Z',
  assignee: null,
  name: 'Generic',
  description: 'Getting started',
  amountCents: 200,
  completedPercentage: 1
};

export function calcPercent(goalAmountCents: number, totalPledgeSumCents: number): number {
  if (!goalAmountCents || totalPledgeSumCents <= 0) {
    return 0;
  }
  const output = Math.min(100, Math.floor((totalPledgeSumCents / goalAmountCents) * 100));
  return output;
}

export async function getGoals(pledgeSum: number): Promise<IGoals | null> {
  try {
    const openData = await fetchAndParseData('open', pledgeSum);
    const closedData = await fetchAndParseData('closed', pledgeSum);


    const inProgress = filterByAssignee(openData);
    const planned = filterByAssignee(openData, true);
    const funded = filterAndSortGoals(openData.concat(closedData), true);
    const unfunded = filterAndSortGoals(openData.concat(closedData), false);

    console.log('the following are unfunded goals')
    console.log(unfunded)

    return {
      complete: closedData,
      inProgress,
      planned,
      featuredFunded: funded[funded.length - 1] || defaultGoal,
      featuredUnfunded: unfunded[0] || bigHairyAudaciousGoal
    };
  } catch (error) {
    console.error('Error fetching goals:', error);
    return null;
  }
}

function filterByAssignee(issues: IIssue[], isPlanned: boolean = false): IIssue[] {
  return issues.filter((issue) => (isPlanned ? issue.assignee === null : issue.assignee !== null))
}

async function fetchAndParseData(state: 'open' | 'closed', pledgeSum: number): Promise<IIssue[]> {
  const response = await fetch(`https://gitea.futureporn.net/api/v1/repos/futureporn/pm/issues?state=${state}&labels=${GOAL_LABEL}`, {
    next: {
      revalidate: CACHE_TIME,
      tags: ['goals']
    },
  });

  if (!response.ok) return [];

  return response.json().then(issues => issues.map((g: IGiteaIssue) => parseGiteaGoal(g, pledgeSum)));
}



function filterAndSortGoals(issues: IIssue[], isFunded: boolean): IIssue[] {
  return issues
    .filter((issue) => issue.amountCents)
    .filter((issue) => (issue.completedPercentage === 100) === isFunded)
    .sort((b, a) => b.amountCents! - a.amountCents!);
}

function parseGiteaGoal(giteaIssue: IGiteaIssue, pledgeSum: number): IIssue {
  const headMatter: any = matter(giteaIssue.body);
  return {
    id: giteaIssue.id,
    title: giteaIssue.title,
    comments: giteaIssue.comments,
    updatedAt: giteaIssue.updated_at,
    createdAt: giteaIssue.created_at,
    assignee: giteaIssue.assignee,
    name: headMatter.data.name || '',
    description: headMatter.data.description || '',
    amountCents: headMatter.data.amountCents || 0,
    completedPercentage: calcPercent(headMatter.data.amountCents, pledgeSum)
  };
}
