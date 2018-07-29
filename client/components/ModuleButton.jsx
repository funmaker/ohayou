import React from 'react';

export default function ModuleButton({Module, ...rest}) {
    return (
        <div className="ModuleButton" {...rest}>
            <Module.renderButton />
        </div>
    );
}
