import { getGoals } from "@/lib/pm";
import { getCampaign } from "@/lib/patreon";

interface IFundingStatusBadgeProps {
    completedPercentage: number;
}

function FundingStatusBadge({ completedPercentage }: IFundingStatusBadgeProps) {
    if (completedPercentage === 100) return <span className="tag is-success">Funded</span>;
    return (
        <span className="tag is-warning">
            <span className="mr-1">
                {completedPercentage}% Funded
            </span>
        </span>
    );
}



// export interface IGoals {
//     complete: IIssue[];
//     inProgress: IIssue[];
//     planned: IIssue[];
//     featuredFunded: IIssue;
//     featuredUnfunded: IIssue;
//   }
export default async function Page() {
    const { pledgeSum } = await getCampaign()
    const goals = await getGoals(pledgeSum);
    if (!goals) return <p>failed to get goals</p>
    const { inProgress, planned, complete } = goals;
    return (
        <>
            <div className="content">
                <div className="block">
                    <div className="box">

                        <h1 className="title">Goals</h1>
                        <p className="subtitle mt-5">
                            <span>In Progress</span>
                        </p>
                        <ul className="">
                            {inProgress.map((goal) => (
                                <li key={goal.id}>
                                    ☐ {goal.title} {(!!goal?.amountCents && !!goal.completedPercentage) && <FundingStatusBadge completedPercentage={goal.completedPercentage} />}
                                </li>
                            ))}
                        </ul>
                        <p className="subtitle mt-5">
                            <span>Planned</span>
                        </p>
                        <ul className="">
                            {planned.map((goal) => (
                                <li key={goal.id}>
                                    ☐ {goal.title} {(!!goal?.amountCents && !!goal.completedPercentage) && <FundingStatusBadge completedPercentage={goal.completedPercentage} />}
                                </li>
                            ))}
                        </ul>
                        <p className="subtitle mt-5">
                            <span>Completed</span>
                        </p>
                        <ul className="">
                            {complete.map((goal) => (
                                <li key={goal.id}>
                                    ✅ {goal.title} {(!!goal?.amountCents && !!goal.completedPercentage) && <FundingStatusBadge completedPercentage={goal.completedPercentage} />}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}