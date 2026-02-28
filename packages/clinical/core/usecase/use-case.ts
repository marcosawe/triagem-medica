export default interface UseCase<IN ,OUT ,U = any>{
  execute(input: IN, user: U): Promise<OUT>
}