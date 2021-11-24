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
          validator={(e) => {
            if (e && e.startsWith('fish_')) {
              return '';
            } else {
              return '需要以fish_开头';
            }
          }}
          decorator={<FormItem label="名字" />}
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
