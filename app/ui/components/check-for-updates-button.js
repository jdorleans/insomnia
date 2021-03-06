// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import * as electron from 'electron';

type Props = {
  children: React.Node,
  className: ?string
};

type State = {
  status: string,
  checking: boolean,
  updateAvailable: boolean
};

@autobind
class CheckForUpdatesButton extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      status: '',
      checking: false,
      updateAvailable: false
    };
  }

  componentDidMount () {
    electron.ipcRenderer.on('updater.check.status', (e, status) => {
      if (this.state.checking) {
        this.setState({status});
      }
    });

    electron.ipcRenderer.on('updater.check.complete', (e, updateAvailable, status) => {
      this.setState({checking: false, status, updateAvailable});
    });
  }

  _handleCheckForUpdates () {
    electron.ipcRenderer.send('updater.check');
    this.setState({checking: true});
  }

  render () {
    const {children, className} = this.props;
    const {status, checking, updateAvailable} = this.state;

    let toShow = children;

    if (checking) {
      toShow = status || children;
    }

    if (updateAvailable) {
      toShow = status;
    }

    return (
      <button className={className}
              disabled={status || updateAvailable}
              onClick={this._handleCheckForUpdates}>
        {toShow}
      </button>
    );
  }
}

export default CheckForUpdatesButton;
