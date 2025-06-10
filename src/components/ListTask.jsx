import React from "react";
import CardTodo from "./CardTodo";

const ListTask = ({
  tasks,
  onPage,
  location,
  smaller,
  Link,
  footerSmaller,
  footerCol,
}) => {
  if (!tasks) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <CardTodo
          title={task.title || ""}
          desc={task.content || ""}
          imageUrl={task.thumbnail || ""}
          footerSmaller={footerSmaller || false}
          smaller={smaller || false}
          key={task._id}
          Link={Link || false}
          id={task._id || ""}
          toLink={`${onPage ? "" : "/"}detail/${task._id}${
            location ? location : ""
          }${onPage ? "" : `${location ? "&" : "?"}type=page`}`}
          priority={task.priority || ""}
          priorityHex={task.priorityColor || ""}
          status={task.status || ""}
          statusHex={task.statusColor || ""}
          createdAt={task.createdAt || ""}
          completedAt={task.completedAt ? task.completedAt : ""}
          footerCol={footerCol || false}
        />
      ))}
    </div>
  );
};

export default ListTask;
