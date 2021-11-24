import {
  FieldBinder,
  createFieldChecker,
  FieldCheckerProvider,
} from 'formily-field-binder';
import React, { useMemo } from 'react';
import { observer } from '@formily/reactive-react';
import { FormLayout, Input, FormItem, NumberPicker } from '@formily/antd';
import { Button } from 'antd';
import 'antd/dist/antd.css';

const Basic: React.FC<any> = observer((props) => {
  let data = useMemo(() => {
    return {};
  }, []);
  let fieldChecker = useMemo(() => {
    return createFieldChecker();
  }, []);

  const onClick = () => {
    console.log('all data', data);
  };

  const check = () => {
    fieldChecker.check();
  };

  return (
    <FieldCheckerProvider value={fieldChecker}>
      <FormLayout>
        <FieldBinder
          data={data}
          name={'name'}
          required={true}
          decorator={<FormItem label="名字" />}
        >
          <Input />
        </FieldBinder>

        <FieldBinder
          data={data}
          name={'age'}
          required={true}
          decorator={<FormItem label="年龄" />}
        >
          <NumberPicker />
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
