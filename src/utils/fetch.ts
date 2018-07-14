export async function fetchData<T>(input, init?): Promise<T> {
  const response = await fetch(input, init);
  return (await response.json()) as Promise<T>;
}
