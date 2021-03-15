import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

// пример, как прокидывать установку потока в пропсах (поток не сверху вниз, а снизу вверх)

type TProps = {
  setcs: Dispatch<SetStateAction<BehaviorSubject<number>>>;
};
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
const counterSubscriber = new BehaviorSubject(0); // эта штука должна лежать в _shared МС с TochkaLazyComponent

// это типа целиком полторашка
export function Product(): JSX.Element {
  return <>
    <Microservice1/>
    <Microservice2/>
  </>;
}

// компонент микросервиса
export function Microservice1(): JSX.Element {
  const [counter, setCounter] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const [counterSubscriber, setCounterSubscriber] = useState(new BehaviorSubject(0));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const subscription = counterSubscriber.subscribe(setCounter);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (): void => subscription.unsubscribe();
  }, [counterSubscriber]);

  const handleClick = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    counterSubscriber.next(0);
    setCounter(0);
  };


  return <>
    <div>Общий счетчик {counter}</div>
    <Consumer setcs={setCounterSubscriber}/>
    <button onClick={handleClick}>Reset</button>
    <div>-----</div>
  </>
}


// компонент микросервиса
export function Microservice2(): JSX.Element {
  const [counter, setCounter] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const [counterSubscriber, setCounterSubscriber] = useState(new BehaviorSubject(0));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const subscription = counterSubscriber.subscribe(setCounter);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (): void => subscription.unsubscribe();
  }, [counterSubscriber]);

  const handleClick = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    counterSubscriber.next(0);
    setCounter(0);
  };

  return <>
    <div>Общий счетчик {counter}</div>
    <Consumer setcs={setCounterSubscriber}/>
    <button onClick={handleClick}>Reset</button>
  </>
}

// компонент TochkaLazyComponent
class Consumer extends React.Component<TProps, { counter: number, cs: BehaviorSubject<number> }> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      counter: 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      cs: counterSubscriber
    };
  }

  componentDidMount(): void {
    this.props.setcs(this.state.cs);
  }

  handleClick = (): void => {
    let { counter, cs } = this.state;
    counter = counter + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const csCounter = Number(cs.getValue()) + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.state.cs.next(csCounter);
    this.setState({ counter });
  };

  render() {
    return (
      <div>
        <h3>TochkaLazyComponent</h3>
        <button onClick={this.handleClick}>Inc</button>
      </div>
    );
  }
}

