import React, { ChangeEvent, useCallback, useState } from 'react';
import Confetti from 'react-confetti';
import { Helmet } from 'react-helmet';
import useWindowSize from 'react-use/lib/useWindowSize';
import styled from 'styled-components';
import { generateJobTitle } from './generate-job-title';
import { Steps } from './steps.enum';

const App = () => {
  const [currentStep, setCurrentStep] = useState(Steps.Welcome);
  const [firstName, setFirstName] = useState('');
  const [industry, setIndustry] = useState('');
  const [monthBorn, setMonthBorn] = useState<number>();
  const { width, height } = useWindowSize();

  const moveStep = useCallback((step: Steps) => setCurrentStep(step), []);

  const moveToStart = useCallback(() => moveStep(Steps.FirstName), [moveStep]);
  const moveToFinish = useCallback(() => moveStep(Steps.Finished), [moveStep]);

  const initializeStep = useCallback(() => {
    setCurrentStep(Steps.Welcome);
    setFirstName('');
    setIndustry('');
    setMonthBorn(undefined);
    moveToStart();
  }, [moveToStart]);

  const onKeyDown = useCallback(
    (step: Steps) => ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
      if (key === 'Enter') {
        moveStep(step);
      }
    },
    [moveStep]
  );

  let jobTitle: string | null = '';
  if (currentStep === Steps.Finished) {
    jobTitle = generateJobTitle(firstName, industry, monthBorn);
    if (!jobTitle) {
      return <>Whoops, An Error Occurred</>;
    }
  }
  return (
    <>
      <Helmet title={process.env.REACT_APP_WEBSITE_NAME}>
        <meta
          property="description"
          content={process.env.REACT_APP_WEBSITE_DESCRIPTION}
        />
        <meta
          property="og:title"
          content={process.env.REACT_APP_WEBSITE_NAME}
        />
        <meta property="og:url" content={process.env.REACT_APP_WEBSITE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={process.env.REACT_APP_DESCRIPTION}
        />
        <meta
          property="og:image"
          content={`${process.env.REACT_APP_WEBSITE_URL}/app-screenshot.jpg`}
        />
        <link rel="canonical" href={process.env.REACT_APP_WEBSITE_URL} />
      </Helmet>
      <Background>
        <Header>
          {currentStep === Steps.Welcome && (
            <>
              <AppTitle>{process.env.REACT_APP_WEBSITE_NAME}</AppTitle>
              <Button
                autoFocus
                type="button"
                onClick={event => {
                  event.preventDefault();
                  initializeStep();
                }}
              >
                Generate Job Title
              </Button>
            </>
          )}
          {currentStep === Steps.FirstName && (
            <>
              <Label htmlFor="firstName">First Name</Label>
              <InputGroup>
                <Input
                  id="firstName"
                  autoFocus
                  autoCapitalize="words"
                  maxLength={30}
                  placeholder="e.g Joe Bloggs"
                  required
                  value={firstName}
                  onChange={event => setFirstName(event.target.value)}
                  onKeyDown={event => {
                    if (firstName) {
                      onKeyDown(Steps.Industry)(event);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={event => {
                    event.preventDefault();
                    if (firstName) {
                      moveStep(Steps.Industry);
                    }
                  }}
                >
                  &rsaquo;
                </Button>
              </InputGroup>
            </>
          )}
          {currentStep === Steps.Industry && (
            <>
              <Label htmlFor="industry">Industry</Label>
              <InputGroup>
                <Input
                  id="industry"
                  autoFocus
                  autoCapitalize="words"
                  maxLength={30}
                  placeholder="e.g. Marketing / Tech / Sales / Design"
                  required
                  value={industry}
                  onChange={event => setIndustry(event.target.value)}
                  onKeyDown={event => {
                    if (industry) {
                      onKeyDown(Steps.MonthBorn)(event);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={event => {
                    event.preventDefault();
                    if (industry) {
                      moveStep(Steps.MonthBorn);
                    }
                  }}
                >
                  &rsaquo;
                </Button>
              </InputGroup>
            </>
          )}
          {currentStep === Steps.MonthBorn && (
            <>
              <Label htmlFor="monthBorn">Month Born</Label>
              <InputGroup>
                <DropDownList
                  id="monthBorn"
                  autoFocus
                  value={monthBorn}
                  required
                  onKeyDown={event => {
                    event.preventDefault();
                    moveToFinish();
                  }}
                  onChange={({
                    target: { value },
                  }: ChangeEvent<HTMLSelectElement>) => {
                    const parsedValue = parseInt(value, 10);
                    if (Number.isSafeInteger(parsedValue)) {
                      setMonthBorn(parsedValue);
                    }
                  }}
                >
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </DropDownList>
                <Button
                  type="button"
                  onClick={event => {
                    event.preventDefault();
                    moveToFinish();
                  }}
                >
                  Finish
                </Button>
              </InputGroup>
            </>
          )}
          {currentStep === Steps.Finished && (
            <>
              <div>
                <ReactConfetti
                  numberOfPieces={100}
                  height={height}
                  width={width}
                />
                <span>Your Job Title Is</span>...{' '}
                <span role="img" aria-label="Drum Roll">
                  🥁
                </span>
                <JobTitle>
                  <span>{jobTitle}</span>
                </JobTitle>
                <p>
                  Don't forget to share your new job title with the world!{' '}
                  <span role="img" aria-label="World">
                    🌍
                  </span>
                </p>
              </div>
              <Button
                autoFocus
                type="button"
                onClick={event => {
                  event.preventDefault();
                  initializeStep();
                }}
              >
                Start Again
              </Button>
            </>
          )}
        </Header>
        <Footer>
          {process.env.REACT_APP_WEBSITE_FOOTER && (
            <p>{process.env.REACT_APP_WEBSITE_FOOTER}</p>
          )}
          <p>
            <span role="img" aria-label="Megaphone">
              📣
            </span>{' '}
            Inspired by an idea from{' '}
            <a
              href="https://caroo.co.uk/"
              title="Caroo"
              rel="noopener noreferrer"
            >
              Caroo
            </a>
          </p>
        </Footer>
      </Background>
    </>
  );
};

const ReactConfetti = styled(Confetti)`
  z-index: 0;
`;

const Background = styled.div`
  background: rgb(221, 0, 79);
  background: linear-gradient(
    90deg,
    rgba(221, 0, 79, 1) 0%,
    rgba(223, 49, 52, 1) 50%,
    rgba(228, 79, 0, 1) 100%
  );
  color: #ffffff;
  text-align: center;
  overflow: auto;
`;

const Header = styled.header`
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const Footer = styled.footer`
  min-height: 15vh;
  p {
    margin: 0;
  }
  a {
    color: #292a37;
  }
`;

const Button = styled.button`
  background-color: transparent;
  font-weight: bolder;
  padding: 0 20px;
  height: 50px;
  transition: all 0.2s ease-in-out;
  font-size: 17px;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 2px;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
  border: 2px solid #fff;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const inputStyles = `
  outline: none;
  margin: 0;
  border: none;
  box-shadow: none;
  font-size: 14px;
  line-height: 50px;
  background: #fafafa;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  padding: 0 20px;
  font-size: 16px;
  color: #666;
  transition: all 0.4s ease;
`;

const Input = styled.input`
  ${inputStyles} ::placeholder {
    text-transform: none;
  }
  text-transform: capitalize;
`;

const InputGroup = styled.div`
  display: flex;
  input[type='text'],
  select {
    flex-grow: 1;
  }
  button {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
`;

const DropDownList = styled.select`
  ${inputStyles}
  height: 50px;
`;

const Label = styled.label`
  font-size: 24px;
  text-transform: capitalize;
  display: block;
  margin-bottom: 5px;
`;

const JobTitle = styled.h2`
  color: black;
  font-size: 36px;
  font-weight: bolder;
  span {
    background-color: #00dd8e;
    padding: 5px;
    width: auto;
  }
  text-transform: capitalize;
`;

const AppTitle = styled.h1`
  text-transform: capitalize;
`;

export default App;
