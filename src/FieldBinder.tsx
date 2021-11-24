import React, { Fragment, useEffect } from 'react';
import { observer } from '@formily/reactive-react';
import { useFieldChecker } from './FieldChecker';

type FieldBinderType = {
  data: any;
  name: string;
  required?: boolean;
  feedBackName?: string;
  extraFeedbackName?: string;
  decorator?: JSX.Element;
  onChange?: (newValue: any) => void;
  children: JSX.Element;
};

const FieldBinder: React.FC<FieldBinderType> = observer((props) => {
  const fieldChecker = useFieldChecker();
  const hasDecorator = !!props.decorator;
  const feedBackName = props.feedBackName || '_feedback_' + props.name;
  const extraFeedbackName =
    props.extraFeedbackName || '_feedback_extra_' + props.name;
  const isRequired = !!props.required;

  let check = (newValue: any) => {
    if (isRequired && (newValue === undefined || newValue == '')) {
      return '请输入数据';
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
});

export default FieldBinder;
