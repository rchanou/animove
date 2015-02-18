import React from 'react';
import clone from 'clone';
import reactifyDomStyle from 'reactify-dom-style';

export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var newProps = clone(otherProps);
    newProps.ref = 'me';
		newProps.id = 'me';

    if (!newProps.style){
      newProps.style = {};
    }

    newProps.origVisibility = newProps.style.visibility;
    newProps.style.visibility = 'hidden';
    return React.createElement(tagName, newProps, children);
  }

  componentDidMount(){
    var me = this.refs.me.getDOMNode();
    var parent = me.parentElement;

    this.animatedNode = document.createElement('span');
    parent.appendChild(this.animatedNode);

    var moverId = '' + new Date().valueOf() + Math.random();

    this.moveAnimatedComponent = () => {
      var rect = me.getBoundingClientRect();
      var parentRect = parent.parentElement.getBoundingClientRect();
      var top = rect.top - parentRect.top;
      var left = rect.left - parentRect.left;

      let { tagName, children, ...otherProps } = this.props;

      var newProps = clone(otherProps);

      delete newProps.className;

      var newStyle = reactifyDomStyle(this.refs.me.getDOMNode());
      newStyle.visibility = otherProps.origVisibility;
      newStyle.position = 'absolute';
      newStyle.top = top;
      newStyle.left = left;

      newProps.style = newStyle;

			newProps.id = moverId;

      var animatedComponent = React.createElement(
        tagName, newProps, children
      );

      React.render(animatedComponent, this.animatedNode, e => {

        /*var moverEl = document.getElementById(moverId);
        moverEl.addEventListener('webkitTransitionEnd', e => {
          console.log('end', e);
        });
        var lastStyle = reactifyDomStyle(this.refs.me.getDOMNode());
        for (var property in me.style){
          if (['visibility', 'position', 'top', 'left'].indexOf(property) === -1){
            console.log(property);
            moverEl.style[property] = me.style[property];
          }
        }*/
        moverEl.style.backgroundColor = me.style.backgroundColor;
        moverEl.style.opacity = me.style.opacity;
      });
    };

    this.moveAnimatedComponent();
  }

  componentDidUpdate(){
    //setTimeout(this.moveAnimatedComponent, 500);
    this.moveAnimatedComponent();
  }

  componentWillUnmount(){
    React.unmountComponentAtNode(this.animatedNode);
  }

};
