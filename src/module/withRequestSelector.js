// @flow
import type {Node} from 'react';
import React from 'react';
import type {RequestActions, RequestContext, ProviderRequestState} from "../QuestrarTypes";
import {initialRequest} from "./common";
import { RequestConsumerContext } from "./context";
import get from 'lodash/get';

type WrappedComponentProps = {
  id: string,
}



/**
 * HOC Wraps a Request component.
 * Select a request in the request tree using the request id provided to the Request component
 * @param WrappedComponent
 * @returns {{new(): {props: WrappedComponentProps, _getRequest, context: RequestContext, render(): *}, prototype: {props: WrappedComponentProps, _getRequest, context: RequestContext, render(): *}}}
 */
export default function withRequestSelector (WrappedComponent: Object) {
  return class extends React.Component<WrappedComponentProps> {
    props: WrappedComponentProps;


    /**
     * Select request of an id provided in props
     * if no request is found for this particular id, a default request is provided
     *
     * @private
     */
    _getRequest = (state: ProviderRequestState) => {

      if(this.props.id) {
        return get(state, this.props.id, initialRequest);
      }
      return initialRequest;
    };

    /**
     * Renders Wrapped Component
     * @param state
     * @returns {*}
     */
    renderComponent = (state: RequestContext) => {
      const data = this._getRequest(state.data);
      const request = Object.assign({}, data, { id: this.props.id });

      return <WrappedComponent {...this.props} actions={state.actions} request={request} />;
    };

    render(){

      return (
        <RequestConsumerContext>
          {this.renderComponent}
        </RequestConsumerContext>
      )
    }
  }

}



