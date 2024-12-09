import React from 'react';
import { CoursePart } from '../App';

const Part: React.FC<{ coursePart: CoursePart }> = ({ coursePart }) => {
  switch (coursePart.kind) {
    case 'basic':
      return (
        <div>
          <h3>{coursePart.name}</h3>
          <p>{coursePart.description}</p>
          <p>Exercises: {coursePart.exerciseCount}</p>
        </div>
      );
    case 'group':
      return (
        <div>
          <h3>{coursePart.name}</h3>
          <p>Group project count: {coursePart.groupProjectCount}</p>
          <p>Exercises: {coursePart.exerciseCount}</p>
        </div>
      );
    case 'background':
      return (
        <div>
          <h3>{coursePart.name}</h3>
          <p>{coursePart.description}</p>
          <p>
            Background material:{' '}
            <a
              href={coursePart.backgroundMaterial}
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>
          </p>
          <p>Exercises: {coursePart.exerciseCount}</p>
        </div>
      );
    case 'special':
      return (
        <div>
          <h3>{coursePart.name}</h3>
          <p>{coursePart.description}</p>
          <p>Requirements: {coursePart.requirements.join(', ')}</p>
          <p>Exercises: {coursePart.exerciseCount}</p>
        </div>
      );
    default:
      return assertNever(coursePart);
  }
};

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

export default Part;
