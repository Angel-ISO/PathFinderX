import { Result } from '../../../shared/errors/Result.js';

describe('Result Monad', () => {
  describe('Basic functionality', () => {
    it('should create a success result', () => {
      const result = Result.ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isFail()).toBe(false);
      expect(result.value).toBe(42);
      expect(result.error).toBeNull();
    });

    it('should create a failure result', () => {
      const result = Result.fail('error message');
      expect(result.isOk()).toBe(false);
      expect(result.isFail()).toBe(true);
      expect(result.value).toBeNull();
      expect(result.error).toBe('error message');
    });

    it('should be immutable', () => {
      const result = Result.ok(42);
      expect(() => { result.value = 43; }).toThrow();
      expect(() => { result.error = 'error'; }).toThrow();
      expect(() => { result.isSuccess = false; }).toThrow();
    });
  });

  describe('map', () => {
    it('should transform the value if result is success', () => {
      const result = Result.ok(42);
      const mappedResult = result.map(x => x * 2);
      
      expect(mappedResult.isOk()).toBe(true);
      expect(mappedResult.value).toBe(84);
    });

    it('should not transform the value if result is failure', () => {
      const result = Result.fail('error message');
      const mappedResult = result.map(x => x * 2);
      
      expect(mappedResult.isFail()).toBe(true);
      expect(mappedResult.error).toBe('error message');
    });
  });

  describe('flatMap', () => {
    it('should apply the function and flatten the result if success', () => {
      const result = Result.ok(42);
      const flatMappedResult = result.flatMap(x => Result.ok(x * 2));
      
      expect(flatMappedResult.isOk()).toBe(true);
      expect(flatMappedResult.value).toBe(84);
    });

    it('should not apply the function if result is failure', () => {
      const result = Result.fail('error message');
      const flatMappedResult = result.flatMap(x => Result.ok(x * 2));
      
      expect(flatMappedResult.isFail()).toBe(true);
      expect(flatMappedResult.error).toBe('error message');
    });

    it('should propagate failure from the function', () => {
      const result = Result.ok(42);
      const flatMappedResult = result.flatMap(x => Result.fail('new error'));
      
      expect(flatMappedResult.isFail()).toBe(true);
      expect(flatMappedResult.error).toBe('new error');
    });
  });

  describe('fold', () => {
    it('should apply onSuccess function if result is success', () => {
      const result = Result.ok(42);
      const folded = result.fold(
        value => `Success: ${value}`,
        error => `Error: ${error}`
      );
      
      expect(folded).toBe('Success: 42');
    });

    it('should apply onFailure function if result is failure', () => {
      const result = Result.fail('error message');
      const folded = result.fold(
        value => `Success: ${value}`,
        error => `Error: ${error}`
      );
      
      expect(folded).toBe('Error: error message');
    });
  });

  describe('getOrElse', () => {
    it('should return the value if result is success', () => {
      const result = Result.ok(42);
      expect(result.getOrElse(0)).toBe(42);
    });

    it('should return the default value if result is failure', () => {
      const result = Result.fail('error message');
      expect(result.getOrElse(0)).toBe(0);
    });
  });

  describe('Monad laws', () => {
    const f = x => Result.ok(x * 2);
    const g = x => Result.ok(x + 10);
    
    it('should satisfy left identity: return(x).flatMap(f) === f(x)', () => {
      const x = 42;
      const leftIdentity1 = Result.ok(x).flatMap(f);
      const leftIdentity2 = f(x);
      
      expect(leftIdentity1.value).toBe(leftIdentity2.value);
      expect(leftIdentity1.isSuccess).toBe(leftIdentity2.isSuccess);
    });
    
    it('should satisfy right identity: m.flatMap(return) === m', () => {
      const m = Result.ok(42);
      const rightIdentity = m.flatMap(Result.ok);
      
      expect(rightIdentity.value).toBe(m.value);
      expect(rightIdentity.isSuccess).toBe(m.isSuccess);
    });
    
    it('should satisfy associativity: m.flatMap(f).flatMap(g) === m.flatMap(x => f(x).flatMap(g))', () => {
      const m = Result.ok(42);
      const associativity1 = m.flatMap(f).flatMap(g);
      const associativity2 = m.flatMap(x => f(x).flatMap(g));
      
      expect(associativity1.value).toBe(associativity2.value);
      expect(associativity1.isSuccess).toBe(associativity2.isSuccess);
    });
  });

  describe('Async operations', () => {
    it('should handle async operations with flatMap', async () => {
      const asyncOperation = async (x) => {
        return new Promise(resolve => {
          setTimeout(() => resolve(Result.ok(x * 2)), 10);
        });
      };
      
      const result = Result.ok(42);
      const asyncResult = await result.flatMap(asyncOperation);
      
      expect(asyncResult.isOk()).toBe(true);
      expect(asyncResult.value).toBe(84);
    });
    
    it('should propagate failures in async chains', async () => {
      const asyncSuccess = async (x) => {
        return new Promise(resolve => {
          setTimeout(() => resolve(Result.ok(x * 2)), 10);
        });
      };
      
      const asyncFailure = async (x) => {
        return new Promise(resolve => {
          setTimeout(() => resolve(Result.fail('async error')), 10);
        });
      };
      
      const result = Result.ok(42);
      const asyncResult = await result
        .flatMap(asyncSuccess)
        .then(r => r.flatMap(asyncFailure));
      
      expect(asyncResult.isFail()).toBe(true);
      expect(asyncResult.error).toBe('async error');
    });
  });
});