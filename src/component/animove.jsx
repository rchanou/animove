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

      var animatedComponent = React.createElement(
        tagName, newProps, children
      );

      React.render(animatedComponent, this.animatedNode, e => {
        var moverEl = this.animatedNode.firstChild;

        var animatableProperties = [
          'transform', 'transformOrigin', 'perspective', 'perspectiveOrigin', 'color', 'opacity', 'columnWidth', 'columnCount',
          'columnGap', 'columnRuleColor', 'columnRuleWidth', 'letterSpacing', 'textIndent', 'wordSpacing', 'textDecorationColor',
          'textShadow', 'flexBasis', 'flexGrow', 'flexShrink', 'order', 'backgroundColor', 'backgroundPosition', 'backgroundSize',
          'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'borderBottomWidth', 'borderLeftWidth',
          'borderRightWidth', 'borderTopWidth', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderTopLeftRadius', 'borderTopRightRadius',
          'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'padding', 'paddingBottom', 'paddingLeft', 'paddingRight',
          'paddingTop', 'maxHeight', 'minHeight', 'height', 'maxWidth', 'minWidth', 'width', 'verticalAlign', 'zIndex', 'fontWeight',
          'fontStretch', 'fontSize', 'lineHeight', 'fontSizeAdjust', 'objectPosition', 'outlineColor', 'outlineWidth', 'outlineOffset',
          'clip', 'shapeOutside', 'shapeMargin', 'shapeImageThreshold'
        ];

        animatableProperties.forEach(property => {
          moverEl.style[property] = me.style[property];
        });
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
