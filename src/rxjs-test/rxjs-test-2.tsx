import React, { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

// пример, как прокидывать поток в пропсах (поток сверху вниз)

type TParams = {
  match: {
    params: {
      id: string,
    }
  }
};

type TProps = {
  cs: BehaviorSubject<number>;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
const counterSubscriber: BehaviorSubject<number> = new BehaviorSubject(0);

export function Product({ match }: TParams): JSX.Element {
  const [counter, setCounter] = useState<number>(Number(match.params?.id));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const subscription = counterSubscriber.subscribe(setCounter);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (): void => subscription.unsubscribe();
  }, []);

  return <>
    <div>{counter}</div>
    <ConsumerA cs={counterSubscriber}/>
    <ConsumerB cs={counterSubscriber}/>
  </>
}

class ConsumerA extends React.Component<TProps, { counter: number }> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      counter: this.props.cs.getValue()
    };
  }

  handleClick = (): void => {
    let { counter } = this.state;
    counter = counter + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const csCounter = Number(this.props.cs.getValue()) + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.props.cs.next(csCounter);
    this.setState({ counter });
  };

  render() {
    return (
      <div>
        <h3>ProducerA</h3>
        {this.state.counter}
        <button onClick={this.handleClick}>Inc</button>
      </div>
    );
  }
}

class ConsumerB extends React.Component<TProps, { counter: number }> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      counter: Number(this.props?.cs?.getValue())
    };
  }

  handleClick = (): void => {
    let { counter } = this.state;
    counter = counter + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const csCounter = Number(this.props.cs.getValue()) + 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.props.cs.next(csCounter);
    this.setState({ counter });
  };

  render() {
    return (
      <div>
        <h3>ProducerB</h3>
        {this.state.counter}
        <button onClick={this.handleClick}>Inc</button>
      </div>
    );
  }
}
