import * as React from 'react';
import {PodWidget, ThemeDiv, Tooltip, WaitFor} from '..';
import {Pod} from '../pod/pod';

import './replica-set.scss';

export interface ReplicaSet {
    objectMeta?: any;
    status?: string;
    icon?: string;
    revision?: number;
    pods?: Array<Pod>;
}

export enum ReplicaSetStatus {
    Running = 'Running',
    Degraded = 'Degraded',
    ScaledDown = 'ScaledDown',
    Healthy = 'Healthy',
    Progressing = 'Progressing',
}

export const ReplicaSetStatusIcon = (props: {status: ReplicaSetStatus}) => {
    let icon, className;
    let spin = false;
    const {status} = props;
    switch (status) {
        case 'Healthy':
        case 'Running': {
            icon = 'fa-check-circle';
            className = 'healthy';
            break;
        }
        case 'ScaledDown': {
            icon = 'fa-arrow-alt-circle-down';
            className = 'paused';
            break;
        }
        case 'Degraded': {
            icon = 'fa-times-circle';
            className = 'degraded';
            break;
        }
        case 'Progressing': {
            icon = 'fa-circle-notch';
            spin = true;
            className = 'progressing';
            break;
        }
        default: {
            icon = 'fa-question-circle';
            className = 'unknown';
        }
    }
    return (
        <Tooltip content={status}>
            <i className={`status-icon--${className} fa ${icon} ${spin && 'fa-spin'}`} />
        </Tooltip>
    );
};

export const ReplicaSets = (props: {replicaSets: ReplicaSet[]; showRevisions?: boolean}) => {
    const {replicaSets} = props;
    if (!replicaSets || replicaSets.length < 1) {
        return <div>No replica sets!</div>;
    }

    return (
        <div>
            {replicaSets?.map(
                (rsInfo, i: any) =>
                    rsInfo.pods &&
                    rsInfo.pods.length > 0 && (
                        <div key={rsInfo.objectMeta ? rsInfo.objectMeta.uid : i} style={{marginBottom: '1em'}}>
                            <ReplicaSet rs={rsInfo} showRevision={props.showRevisions} />
                        </div>
                    )
            )}
        </div>
    );
};

export const ReplicaSet = (props: {rs: ReplicaSet; showRevision?: boolean}) => {
    const rsName = props.rs.objectMeta ? props.rs.objectMeta.name : 'Unknown';
    return (
        <ThemeDiv className='pods'>
            {rsName && (
                <ThemeDiv className='pods__header'>
                    <span style={{marginRight: '5px'}}>{rsName}</span> <ReplicaSetStatusIcon status={props.rs.status as ReplicaSetStatus} />
                    {props.showRevision && <div style={{marginLeft: 'auto'}}>Revision {props.rs.revision}</div>}
                </ThemeDiv>
            )}

            {props.rs.pods && props.rs.pods.length > 0 && (
                <ThemeDiv className='pods__container'>
                    <WaitFor loading={(props.rs.pods || []).length < 1}>
                        {props.rs.pods.map((pod, i) => (
                            <PodWidget key={pod.objectMeta ? pod.objectMeta.uid : i} pod={pod} />
                        ))}
                    </WaitFor>
                </ThemeDiv>
            )}
        </ThemeDiv>
    );
};
