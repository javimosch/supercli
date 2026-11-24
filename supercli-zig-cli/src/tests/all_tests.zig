// all_tests.zig — Central test container. Imports all test files so
// `zig build test` (root: src/main.zig) discovers every test via the
// `test { _ = @import("tests/all_tests.zig"); }` block in main.zig.
const std = @import("std");

test {
    _ = @import("executor_tests.zig");
    _ = @import("skills_catalog_tests.zig");
    _ = @import("args_tests.zig");
    _ = @import("config_tests.zig");
    _ = @import("lockfile_tests.zig");
    _ = @import("output_tests.zig");
    _ = @import("registry_tests.zig");
    _ = @import("update_tests.zig");
    _ = @import("handlers/bootstrap_tests.zig");
    _ = @import("handlers/commands_tests.zig");
    _ = @import("handlers/discover_tests.zig");
    _ = @import("handlers/doctor_tests.zig");
    _ = @import("handlers/execute_tests.zig");
    _ = @import("handlers/help_tests.zig");
    _ = @import("handlers/install_tests.zig");
    _ = @import("handlers/learn_tests.zig");
    _ = @import("handlers/misc_tests.zig");
    _ = @import("handlers/onboard_tests.zig");
    _ = @import("handlers/plugins_tests.zig");
    _ = @import("handlers/run_tests.zig");
}
