#!/usr/bin/env perl
# Check for unescaped Perl modifiers (\u, \l, \L, \U, \E) in files
# These cause JS SyntaxError when embedded in cli.js

use strict;
use warnings;

my $found = 0;

foreach my $file (@ARGV) {
    open(my $fh, '<', $file) or next;
    my $line_num = 0;
    my @issues;

    while (my $line = <$fh>) {
        $line_num++;
        # Match \u, \l, \L, \U, \E not preceded by another backslash
        # and not followed by 4 hex digits (valid Unicode like \u0041)
        while ($line =~ /(?<!\\)\\([uUlLE])(?![0-9a-fA-F]{4})/g) {
            push @issues, "  Line $line_num: \\$1 should be \\\\$1";
        }
    }
    close($fh);

    if (@issues) {
        print "$file:\n";
        print join("\n", @issues), "\n";
        $found = 1;
    }
}

exit($found);
