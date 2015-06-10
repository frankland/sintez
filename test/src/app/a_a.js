import d_a from './deps/d_a';
import d_b from './deps/d_b';
import v_b from '../vendor/v_b';

console.log('a_a');

d_a();
d_b();
v_b();

export default () => {
  console.log('a_a inner');
}

