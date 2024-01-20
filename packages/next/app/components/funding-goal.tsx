
import { getCampaign } from "@/lib/patreon";
import { getGoals, IGoals } from '@/lib/pm'
import Image from 'next/image';
import React from 'react';
import Link from 'next/link'



export default async function FundingGoal(): Promise<React.JSX.Element> {
    const campaignData = await getCampaign();
    const { pledgeSum, patronCount } = campaignData;

    const goals = await getGoals(pledgeSum);
    if (!goals || !goals?.featuredFunded?.amountCents || !goals?.featuredUnfunded?.amountCents || !goals?.featuredFunded?.amountCents || !goals?.featuredUnfunded?.completedPercentage || !goals?.featuredFunded?.completedPercentage ) return <></>

    return (
        <>
            {/* <p>
                pledgeSum:{JSON.stringify(pledgeSum, null, 2)}
            </p>
            <p>
                patronCount:{JSON.stringify(patronCount, null, 2)}
            </p>
            <p>featuredFunded:{JSON.stringify(goals.featuredFunded)}</p>
            <p>featuredUnfunded:{JSON.stringify(goals.featuredUnfunded)}</p>  */}
            
            {/* <pre>
                <code>
                    {JSON.stringify(goals, null, 2)}
                </code>
            </pre> */}

            <article className="message is-info">
                <div className="message-header">
                    Funding Goal
                    <figure className="image is-32x32 is-rounded">
                        <Link target="_blank" href="https://twitter.com/cj_clippy">
                            <Image className="is-rounded" src="https://futureporn-b2.b-cdn.net/cj_clippy.jpg" alt="CJ_Clippy" fill />
                        </Link>
                    </figure>
                </div>
                <div className="message-body has-text-centered">
                    <div className="columns">
                        {/* the most recently funded goal */}
                        <div className="column is-one-third">
                            {/* const { featuredFunded, featuredUnfunded } = goals;
                        if (!featuredFunded?.amountCents || !featuredFunded?.completedPercentage) return <></>
                        if (!featuredUnfunded?.amountCents || !featuredUnfunded?.completedPercentage) return <></> */}

                            <p className="subtitle">${(goals.featuredFunded.amountCents * (goals.featuredFunded.completedPercentage * 0.01) / 100)} of {goals.featuredFunded.amountCents / 100} ({goals.featuredFunded.completedPercentage}%)
                            </p>
                            <div className="mb-5 tag is-success is-rounded" style={{ width: '100%' }}>
                                FUNDED
                            </div>
                            <p>{goals.featuredFunded.description}</p>
                        </div>

                        {/* the next unfunded goal */}
                        <div className="column is-two-thirds">
                            <p className="subtitle">${(goals.featuredUnfunded.amountCents * (goals.featuredUnfunded.completedPercentage * 0.01) / 100) | 0} of ${goals.featuredUnfunded.amountCents / 100} ({goals.featuredUnfunded.completedPercentage}%)</p>
                            <progress
                                className="progress is-info is-large"
                                value={goals.featuredUnfunded.completedPercentage}
                                max="100"
                            >
                                {goals.featuredUnfunded.completedPercentage}%
                            </progress>
                            <p>{goals.featuredUnfunded.description}</p>
                        </div>
                    </div>

                    <p className="mt-3 subtitle is-4">
                        Thank you, <Link href="/patrons">Patrons!</Link>
                    </p>
                </div>
            </article>
        </>
    );
};

