import React, { Fragment, useEffect } from 'react';
import { observer } from '@formily/reactive-react';
import { useFieldChecker } from './FieldChecker';

type FieldBinderType = {
  data: any;
  name: string;
  required?: boolean;
  validator?: (newValue: any) => string;
  feedBackName?: string;
  extraFeedbackName?: string;
  decorator?: JSX.Element;
  onChange?: (newValue: any) => void;
  children: JSX.Element;
};

/*
 * 设计目标：
 * 抽象粒度小，将FormItem看成是纯粹的渲染组件，这里Antd4的FormItem做不了，只有Antd3和Formily的FormItem可以做
 * 可控渲染，Field的dataSource，feedback数据与value数据放在一起维护，避免Formily的setFieldState问题
 * 易组合，FildBinder仅仅做了输入组件的双向绑定，以及Feedback的自动触发，其他的操作依然保留给用户自己来完成，简陋但是约束更少
 * 性能好，使用observer实现，只触发必要组件的渲染。同时，外层也轻松拉到整个data数据，不需要引入新的API。
 */

const FieldBinder: React.FC<FieldBinderType> = observer(
  (props: FieldBinderType) => {
    const fieldChecker = useFieldChecker();
    const hasDecorator = !!props.decorator;
    const feedBackName = props.feedBackName || '_feedback_' + props.name;
    const extraFeedbackName =
      props.extraFeedbackName || '_feedback_extra_' + props.name;
    const isRequired = !!props.required;

    let check = (newValue: any) => {
      if (isRequired && (newValue === undefined || newValue == '')) {
        return '请输入数据';
      } else if (props.validator) {
        return props.validator(newValue);
      } else {
        return '';
      }
    };
    let feedbackCheck = () => {
      let newValue = props.data[props.name];
      let feedBackText = check(newValue);
      props.data[feedBackName] = feedBackText;
      return feedBackText;
    };

    useEffect(() => {
      let currentId = fieldChecker.getNextId();
      fieldChecker.putFieldBinder(currentId, async () => {
        let extraFeedbackText = props.data[extraFeedbackName] || '';
        return feedbackCheck() == '' && extraFeedbackText == '';
      });
      return () => {
        fieldChecker.delFieldBinder(currentId);
      };
    }, []);

    let onChange = (newValue: any) => {
      props.data[props.name] = newValue;
      feedbackCheck();
      if (props.onChange) {
        props.onChange(newValue);
      }
    };

    //计算decorator
    let decoratorElement: JSX.Element = <Fragment />;
    let decoratorProps: any = {};
    if (hasDecorator) {
      let feedbackText = props.data[feedBackName] || '';
      let extraFeedbackText = props.data[extraFeedbackName] || '';
      let allFeedbackText = [];
      if (feedbackText != '') {
        allFeedbackText.push(feedbackText);
      }
      if (extraFeedbackText != '') {
        allFeedbackText.push(extraFeedbackText);
      }
      if (allFeedbackText.length == 0) {
        decoratorProps = {};
      } else {
        decoratorProps = {
          feedbackStatus: 'error',
          feedbackText: allFeedbackText.join('，'),
        };
      }
      if (isRequired) {
        decoratorProps.asterisk = true;
      } else {
        decoratorProps.asterisk = false;
      }

      decoratorElement = props.decorator!;
    }
    //计算value
    let inputElement: JSX.Element = props.children;
    let inputProps = {
      value: props.data[props.name],
      onChange: onChange,
    };
    //返回值
    return React.cloneElement(
      decoratorElement,
      decoratorProps,
      React.cloneElement(inputElement, inputProps),
    );
  },
);

export default FieldBinder;
