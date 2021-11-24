import {
  FieldBinder,
  createFieldChecker,
  FieldCheckerProvider,
} from 'field-binder';
import React, { useMemo } from 'react';
import { observer } from '@formily/reactive-react';
import { FormLayout, Input, FormItem, NumberPicker } from '@formily/antd';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { observable } from '@formily/reactive';

const MyInput: React.FC<any> = (props) => {
  return (
    <Input
      {...props}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e.target.value);
        }
      }}
    />
  );
};

const Basic: React.FC<any> = observer((props) => {
  let data = useMemo(() => {
    return observable({} as any);
  }, []);
  let fieldChecker = useMemo(() => {
    return createFieldChecker();
  }, []);

  const onClick = () => {
    console.log('all data', data);
  };

  const check = async () => {
    console.log('校验结果为：' + (await fieldChecker.check()));
  };

  console.log('top render');

  return (
    <FieldCheckerProvider value={fieldChecker}>
      <FormLayout layout={'vertical'}>
        <FieldBinder
          data={data}
          name={'name'}
          required={true}
          decorator={<FormItem label="名字" />}
        >
          <MyInput />
        </FieldBinder>

        <FieldBinder
          data={data}
          name={'password1'}
          required={true}
          onChange={() => {
            if (data.password1 != data.password2) {
              data._feedback_extra_password2 = '前后密码不一致';
              data._feedback_extra_password1 = '前后密码不一致';
            } else {
              data._feedback_extra_password2 = '';
              data._feedback_extra_password1 = '';
            }
          }}
          decorator={<FormItem label="新密码" />}
        >
          <MyInput />
        </FieldBinder>
        <FieldBinder
          data={data}
          name={'password2'}
          onChange={() => {
            if (data.password1 != data.password2) {
              data._feedback_extra_password2 = '前后密码不一致';
              data._feedback_extra_password1 = '前后密码不一致';
            } else {
              data._feedback_extra_password2 = '';
              data._feedback_extra_password1 = '';
            }
          }}
          required={true}
          decorator={<FormItem label="再次输入新密码" />}
        >
          <MyInput />
        </FieldBinder>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={onClick}>{'查看数据'}</Button>
          <Button onClick={check}>{'校验数据'}</Button>
        </div>
      </FormLayout>
    </FieldCheckerProvider>
  );
});

export default Basic;
