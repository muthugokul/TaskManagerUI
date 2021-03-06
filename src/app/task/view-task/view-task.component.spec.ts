import { of } from "rxjs";

import { TaskService } from "../services/task.service";
import { ViewTaskComponent } from "./view-task.component";
import { Task } from "../models/task.model";
import { SelectorModalService } from "src/app/modals/services/selector-modal.service";

describe("View task component", () => {
    let component: ViewTaskComponent;
    let taskService: TaskService;
    let selectorModalService: SelectorModalService;

    let tasks: Task[];

    beforeEach(() => {

        tasks = [
            new Task(1, "Task 1", 1, "Project 1", true, undefined, undefined, 1, 1, "User 1"),
            new Task(2, "Task 2", 2, "Project 2", true, undefined, undefined, 1, 2, "User 2")
        ];
        taskService = jasmine.createSpyObj(TaskService.name, ["getTasks"]);
        (taskService.getTasks as jasmine.Spy).and.returnValue(of(tasks));

        selectorModalService = jasmine.createSpyObj(SelectorModalService.name, ["openSelectorModal"]);

        component = new ViewTaskComponent(taskService, selectorModalService);
    });

    describe("ngOnInit", () => {
        it("should call getTasks of task service", () => {
            component.ngOnInit();

            expect(taskService.getTasks).toHaveBeenCalled();
        });

        it("should assing expected tasks", () => {
            component.ngOnInit();

            expect(component.tasks).toBeDefined();
            expect(component.tasks.length).toBe(tasks.length);
            expect(component.tasks).toBe(tasks);
        });
    });

    describe("reloadTasks", () => {
        it("should call getTasks of task service", () => {
            component.reloadTasks();

            expect(taskService.getTasks).toHaveBeenCalled();
        });

        it("should assing expected tasks", () => {
            component.reloadTasks();

            expect(component.tasks).toBeDefined();
            expect(component.tasks.length).toBe(tasks.length);
            expect(component.tasks).toBe(tasks);
        });
    });

    describe("selectProject", () => {
        it("should call open selector modal method", () => {
            component.selectProject();

            expect(selectorModalService.openSelectorModal).toHaveBeenCalled();
        });
    });
});