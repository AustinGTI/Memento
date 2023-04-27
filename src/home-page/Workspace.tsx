import React from "react";


enum KnowledgeType {
    TEXT = 'text',
    TREE = 'tree',
}

/**
 * the workspace component that is the main content of the home page
 * @constructor
 */
export default function Workspace() {
    // ? CONSTANTS AND STATES
    return (
        <div className={'workspace-box'}>
            <div className={'query-box'}>
                <input type={'text'} placeholder={'Query'}/>
                <button>Digest</button>
            </div>
            <div className={'knowledge-box'}>
            </div>
        </div>
    );
}

