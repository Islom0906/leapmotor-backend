const krill=require('../utils/krillToLotin')
describe('krill To Lotin',()=>{
    it('should return lotin text', () => {
        const result= krill('меня зовут ислам')
        expect(result).toBe('menya zovut islam')
    });

    it('should return lotin text', () => {
        const result= krill('меня зовут ислам 123')
        expect(result).toBe('menya zovut islam 123')
    });

    it('should return lotin text', () => {
        const result= krill('55')
        expect(result).toBe('55')
    });
})