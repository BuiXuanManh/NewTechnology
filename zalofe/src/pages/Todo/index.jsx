function Todo() {
  return (
    <div className="h-full w-full flex-1 flex-col">
      <div></div>
      <div className="flex-1 pl-4 ">
        <div className="h-screen w-full overflow-auto">
          <div className="flex w-full items-center pr-2">
            <div className="transition-min-width flex min-w-[calc(100vw-600px)] items-center text-[#7589A3] duration-200 md:min-w-[306px]">
              <p className="text-justify text-rose-600">
               ok
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
